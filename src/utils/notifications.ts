import { DC_sendMessage, DC_toMessageCard, DC_toMessageTitle } from "./discord";
import { makeEmailHtml } from "./html-card";
import { sendMail } from "./mail";
import type { flatInfoItem } from "./types";

export async function sendCards(cards: flatInfoItem[]) {
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
