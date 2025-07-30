import type { resultlistEntry, resultListModel } from "../types";
import type { Browser } from "puppeteer";
import { handlePageResponses } from "./puppeteer-utils";
import { getSeenList } from "./seen-list";
import { sendMail } from "./mail";
import { makeEmailHtml } from "./html-card";
import type { flatInfoItem } from "./types";
import { DC_sendMessage, DC_toMessageCard, DC_toMessageTitle } from "./discord";

export function constructIS24Url({
    bundesland,
    stadt,
    totalRent,
}: {
    stadt: string;
    totalRent: number;
    bundesland: string;
}) {
    return `https://www.immobilienscout24.de/Suche/de/${bundesland}/${stadt}/wohnung-mieten?price=-${totalRent}&pricetype=calculatedtotalrent&enteredFrom=result_list`;
}

export async function IS24_extraData(text: string) {
    const matches = text.match(
        /IS24.resultList = [^]*?resultListModel: (?<data>.*),/,
    )?.groups?.data;

    if (matches) {
        const results = (JSON.parse(matches ?? "") as resultListModel)
            .searchResponseModel["resultlist.resultlist"];
        return results;
    }
}

export async function IS24_getAllPages(
    url: string,
    browser: Browser,
): Promise<resultListModel["searchResponseModel"]["resultlist.resultlist"][]> {
    const results =
        [] as resultListModel["searchResponseModel"]["resultlist.resultlist"][];

    const responses = await handlePageResponses({
        onResponse: async (res, contr) => {
            if (res.url() === url) {
                const data = await IS24_extraData(await res.text());
                if (data) {
                    contr.abort("found data");
                    return data;
                }
            }
        },
        page: await browser.newPage(),
        url: url,
    });

    for (const response of responses) {
        if (response) results.push(response);
    }

    const last = results[results.length - 1];
    if (results.length && last.paging.next)
        return results.concat(
            await IS24_getAllPages(
                `https://www.immobilienscout24.de${last.paging.next["@xlink.href"]}`,
                browser,
            ),
        );

    return results;
}

export async function IS24_filterSeen(
    all: resultListModel["searchResponseModel"]["resultlist.resultlist"][],
): Promise<resultlistEntry["resultlist.realEstate"][]> {
    const seen = await getSeenList();
    const unseen = all
        .flatMap((p) =>
            p.resultlistEntries.flatMap((e) =>
                Array.isArray(e.resultlistEntry)
                    ? e.resultlistEntry.map((e) => e["resultlist.realEstate"])
                    : e.resultlistEntry["resultlist.realEstate"],
            ),
        )
        .filter((e) => !seen.find((id) => id === e["@id"]));
    return unseen;
}

export function IS24_summarizeToCards(
    list: resultlistEntry["resultlist.realEstate"][],
): flatInfoItem[] {
    const cards = list.map((i) => {
        const image = (i.galleryAttachments?.attachment
            .filter(
                (img) =>
                    img["@xsi.type"] === "common:Picture" &&
                    img.floorplan === "false",
            )
            .map((img) =>
                img && img["@xsi.type"] === "common:Picture"
                    ? img.urls[0].url["@href"]
                          .replace("%WIDTH%", "500")
                          .replace("%HEIGHT%", "300")
                    : null,
            ) ?? []) as string[];

        const tags: string[] = [];

        if (i.builtInKitchen === "true") tags.push("Einbauküche");
        if (i.balcony === "true") tags.push("Balkon");
        if (i.garden === "true") tags.push("Garten");
        if (i.constructionYear) tags.push(`${i.constructionYear}`);

        return {
            id: i["@id"],
            company: i.realtorCompanyName ?? null,
            title: i.title,
            totalRent: i.calculatedTotalRent.totalRent.value,
            space: i.livingSpace,
            rooms: i.numberOfRooms,
            street: i.address.street ?? null,
            quater: i.address.quarter ?? null,
            houseNumber: i.address.houseNumber ?? null,
            image,
            tags,
        };
    });

    cards.sort((a, b) => a.totalRent - b.totalRent);

    return cards;
}

export async function IS24_sendCards(cards: flatInfoItem[]) {
    const title = `Neue Wohnungen (${cards.length})`;
    const hasDiscordEnv =
        process.env.DISCORD_CHANNEL_ID && process.env.DISCORD_BOT_TOKEN;
    const hasEmailEnv =
        process.env.MAIL_RECEIVER &&
        process.env.MAIL_ADDRESS &&
        process.env.MAIL_PASS &&
        process.env.MAIL_HOST &&
        process.env.MAIL_PORT;

    if (!hasEmailEnv && !hasDiscordEnv)
        throw Error("Missing notification envs");

    if (hasEmailEnv) {
        await sendMail({
            subject: title,
            html: makeEmailHtml({
                title: title,
                items: cards,
            }),
        });
    }

    if (hasDiscordEnv) {
        await DC_sendMessage(DC_toMessageTitle(title));

        for (const card of cards) {
            await DC_sendMessage(DC_toMessageCard(card));
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    return cards.map((i) => i.id);
}
