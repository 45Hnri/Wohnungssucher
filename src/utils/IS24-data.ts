import type { resultListModel } from "../types";
import type { Browser } from "puppeteer";
import { handlePageResponses } from "./puppeteer-utils";
import type { flatInfoItem } from "./types";

export function IS24_constructURL({
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

export function IS24_summarizeToCards(
    list: resultListModel["searchResponseModel"]["resultlist.resultlist"][],
): flatInfoItem[] {
    const cards = list
        .flatMap((p) =>
            p.resultlistEntries.flatMap((e) =>
                Array.isArray(e.resultlistEntry)
                    ? e.resultlistEntry.map((e) => e["resultlist.realEstate"])
                    : e.resultlistEntry["resultlist.realEstate"],
            ),
        )
        .map((i) => {
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
                link: `https://www.immobilienscout24.de/expose/${i["@id"]}`,
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
