import { assertEnv } from "./helper";
import type { flatInfoItem } from "./types";

// https://discord.com/developers/docs/components/reference#container

const DC_compTypes = {
    Action_Row: 1,
    Button: 2,
    String_Select: 3,
    Text_Input: 4,
    User_Select: 5,
    Role_Select: 6,
    Mentionable_Select: 7,
    Channel_Select: 8,
    Section: 9,
    Text_Display: 10,
    Thumbnail: 11,
    Media_Gallery: 12,
    File: 13,
    Separator: 14,
    Container: 17,
};

export async function DC_sendMessage(message: {}) {
    const url = `https://discordapp.com/api/v8/channels/${assertEnv("DISCORD_CHANNEL_ID")}/messages`;
    const headers = {
        Authorization: `Bot ${assertEnv("DISCORD_BOT_TOKEN")}`,
        "User-Agent": "Wohnungssucher",
        "Content-Type": "application/json",
    };

    const res = await fetch(url, {
        body: JSON.stringify(message),
        headers,
        method: "post",
    });

    if (!res.ok) console.error(`Discord bad request: ${res.statusText}`);

    return res;
}

export function DC_toMessageTitle(title: string) {
    return {
        flags: 32768,
        components: [
            {
                type: DC_compTypes.Text_Display,
                content: `# ${title}`,
            },
        ],
    };
}

export function DC_toMessageCard({
    company,
    houseNumber,
    image,
    quater,
    rooms,
    space,
    street,
    tags,
    title,
    totalRent,
    id,
}: flatInfoItem) {
    const divider = {
        type: DC_compTypes.Separator,
        spacing: 1,
    };

    const separator = {
        ...divider,
        divider: false,
    };

    return {
        flags: 32768,
        components: [
            separator,
            separator,
            {
                type: 17,
                accent_color: 16777215 * Math.random(),
                components: [
                    !!image?.length && {
                        type: DC_compTypes.Media_Gallery,
                        items: image.slice(0, 4).map((url) => ({
                            media: {
                                url,
                            },
                        })),
                    },
                    {
                        type: DC_compTypes.Text_Display,
                        content: `# [${title}](https://www.immobilienscout24.de/expose/${id})`,
                    },
                    !!company && {
                        type: DC_compTypes.Text_Display,
                        content: `-# ${company}`,
                    },
                    separator,
                    {
                        type: DC_compTypes.Action_Row,
                        components: [
                            {
                                type: DC_compTypes.Button,
                                style: 1,
                                label: `${space}m²`,
                                custom_id: 1,
                            },
                            {
                                type: DC_compTypes.Button,
                                label: `${totalRent}€`,
                                style: 1,
                                custom_id: 2,
                            },
                            {
                                type: DC_compTypes.Button,
                                style: 1,
                                label: `${rooms} Raum`,
                                custom_id: 3,
                            },
                        ],
                    },
                    divider,
                    {
                        type: DC_compTypes.Action_Row,
                        components: [
                            {
                                type: DC_compTypes.Button,
                                style: 2,
                                label: quater ?? "-",
                                custom_id: 4,
                            },
                            !!street && {
                                type: DC_compTypes.Button,
                                label: `${street} ${houseNumber}`,
                                style: 5,
                                url: `https://www.google.com/maps/place/${encodeURI(`${street} ${houseNumber ?? ""}`)},Halle+(Saale)`,
                            },
                        ].filter((i) => i),
                    },
                    !!tags.length && divider,
                    !!tags.length && {
                        type: DC_compTypes.Action_Row,
                        components: tags.slice(0, 3).map((t, i) => ({
                            type: DC_compTypes.Button,
                            style: 2,
                            label: t,
                            custom_id: i + 6,
                            disabled: true,
                        })),
                    },
                    tags.length > 3 && {
                        type: DC_compTypes.Action_Row,
                        components: tags.slice(3, 6).map((t, i) => ({
                            type: DC_compTypes.Button,
                            style: 2,
                            label: t,
                            custom_id: i + 9,
                            disabled: true,
                        })),
                    },
                ].filter((i) => i),
            },
            separator,
            separator,
        ],
    };
}
