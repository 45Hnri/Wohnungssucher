import puppeteer from "puppeteer";
import { IS24_consent } from "./src/cookies";
import {
    constructIS24Url,
    IS24_filterSeen,
    IS24_getAllPages,
    IS24_sendCards,
    IS24_summarizeToCards,
} from "./src/utils/IS24-data";
import { assertEnv } from "./src/utils/helper";
import { isDocker } from "./src/utils/docker";
import { appendSeenList } from "./src/utils/seen-list";

/*
 * TODO:
 * inline styles for email support
 * auto apply (LATER?)
 */

async function main() {
    const IS24Url = constructIS24Url({
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

    const all = await IS24_getAllPages(IS24Url, browser);

    const unseen = await IS24_filterSeen(all);

    if (unseen.length) {
        const ids = await IS24_sendCards(IS24_summarizeToCards(unseen));
        await appendSeenList(ids);
        console.log("found", ids.length);
    } else {
        console.log("nothing new");
    }

    await browser.close();
}

await main();
