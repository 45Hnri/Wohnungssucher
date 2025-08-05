import type { Browser } from "puppeteer";
import type { flatInfoItem } from "./types";
import { disguisePage } from "./puppeteer-utils";
import { assertEnv, getTextNodes } from "./helper";

export function IW_constructURL({
    locationId,
    rent,
    page,
}: {
    locationId: string;
    rent: number | string;
    page?: number;
}) {
    return `https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=${locationId}&priceMax=${rent}&projectTypes=New_Build,Short_Time_Rental,Stock${page ? `&page=${page}` : ""}`;
}

export function IW_textsToAttributes(texts: string[]) {
    const info: flatInfoItem = {
        id: "???",
        link: "-",
        company: "???",
        houseNumber: "???",
        quater: "???",
        rooms: "???",
        space: 0,
        street: "???",
        title: "???",
        rent: 0,
        tags: [],
        image: [],
    };

    const fullAddress = texts.find((t) => /\(\d{5}\)$/.test(t));
    if (fullAddress) {
        const street = fullAddress.match(/(?<NAME>^\D+) (?<NR>\d+)/);
        if (street?.[0] && street.groups) {
            info.street = street.groups.NAME;
            info.houseNumber = street.groups.NR;

            const parts = fullAddress.split(",");
            if (parts.length === 3) info.quater = parts[1].trim();
        }
    }

    const rooms = texts.find((t) => /^\d+\s*Zimmer$/.test(t));
    if (rooms) info.rooms = rooms.match(/^\d+/)?.[0] ?? 0;

    const space = texts.find((t) => /m²$/.test(t));
    if (space) info.space = Number(space.match(/^\d+/)?.[0] ?? 0);

    const floorNr = texts.find((t) => /Geschoss$/.test(t));
    if (floorNr) info.tags.push(floorNr);

    const price = texts.find((t) => /€$/.test(t));
    if (price) info.rent = Number(price.match(/^\d+/)?.[0] ?? 0);

    const dateFree = texts.find((t) => /^frei ab/.test(t));
    if (dateFree) info.tags.push(dateFree);

    const title = texts.find((t) => /^Wohnung zur Miete$/.test(t));
    if (title) info.title = title;

    return info;
}

export async function IW_getAllPages(
    browser: Browser,
    pageNr?: number,
): Promise<flatInfoItem[]> {
    const results: flatInfoItem[] = [];

    const url = IW_constructURL({
        locationId: assertEnv("LOCATIONID"),
        rent: assertEnv("RENT"),
        page: pageNr,
    });

    const page = await browser.newPage();

    await disguisePage(page);

    await page.goto(url);

    await page.waitForNetworkIdle();

    const links = await page.evaluate((getTextNodesStr) => {
        const toTexts = eval(`(${getTextNodesStr})`);
        const aTags = Array.from(document.querySelectorAll("a"));
        return aTags
            .filter((a) => a.title && a.parentNode)
            .map((a) => {
                const texts: string[] = toTexts(a.parentNode!) ?? [];
                const images = Array.from(
                    a.parentNode?.querySelectorAll("img") ?? [],
                );
                return {
                    id: a.href.match(/(?<ID>[^/]+)\?/)?.groups?.ID,
                    text: texts,
                    title: a.title,
                    image:
                        images.length > 1
                            ? images[1].src
                            : (images[0].src ?? null),
                };
            });
    }, getTextNodes.toString());

    links
        .filter((l) => l.id)
        .forEach((l) => {
            const card = IW_textsToAttributes(l.text);
            if (l.image) card.image.push(l.image);
            if (l.id) {
                card.id = l.id;
                card.link = `https://www.immowelt.de/expose/${l.id}`;
            }
            results.push(card);
        });

    const next = await page.$('button[aria-label="nächste seite"]');

    if (next) {
        const nextResults = await IW_getAllPages(browser, (pageNr ?? 1) + 1);
        for (const n of nextResults) {
            results.push(n);
        }
    }

    return results;
}
