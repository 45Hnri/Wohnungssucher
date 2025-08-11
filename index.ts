import puppeteer from "puppeteer";
import { IS24_consent } from "./src/cookies";
import {
    IS24_constructURL,
    IS24_getAllPages,
    IS24_summarizeToCards,
} from "./src/utils/IS24-data";
import { assertEnv } from "./src/utils/helper";
import { isDocker } from "./src/utils/docker";
import { appendSeenList, filterSeen } from "./src/utils/seen-list";
import { IW_getAllPages } from "./src/utils/IW-data";
import { sendCards } from "./src/utils/notifications";
import type { flatInfoItem } from "./src/utils/types";

async function main() {
    const IS24_URL = IS24_constructURL({
        bundesland: assertEnv("BUNDESLAND"),
        stadt: assertEnv("STADT"),
        totalRent: Number(assertEnv("TOTALRENT")),
    });

    const dockerArgs = ["--no-sandbox"];

    const browser = await puppeteer.launch({
        headless: !process.env.DEV,
        slowMo: process.env.DEV ? 100 : undefined,
        args: (await isDocker()) ? dockerArgs : undefined,
    });

    await browser.setCookie(IS24_consent);

    const allCards: flatInfoItem[] = [];

    IS24_summarizeToCards(await IS24_getAllPages(IS24_URL, browser)).forEach(
        (c) => allCards.push(c),
    );

    if (process.env.RENT && process.env.LOCATIONID) {
        (await IW_getAllPages(browser)).forEach((c) => allCards.push(c));
    }

    await browser.close();

    const unseen = await filterSeen(allCards);

    if (unseen.length) {
        const ids = await sendCards(unseen);
        await appendSeenList(ids);
        console.log("found", ids.length);
    } else {
        console.log("nothing new (all.length)");
    }
}

await main();
