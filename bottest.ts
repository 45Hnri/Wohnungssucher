const url = `https://discordapp.com/api/v8/channels/${process.env.DISCORD_CHANNEL_ID}/messages`;
const headers = {
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    "User-Agent": "Wohnungssucher",
    "Content-Type": "application/json",
};

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

const body = {
    flags: 32768,
    components: [
        {
            type: 17,
            accent_color: 16777215 * Math.random(),
            components: [
                {
                    type: DC_compTypes.Media_Gallery,
                    items: [
                        {
                            media: {
                                url: "https://pictures.immobilienscout24.de/listings/160788ab-0184-4529-85ce-16415c2b4d62-1780385856.jpg/ORIG/legacy_thumbnail/388x388/format/jpg/quality/90",
                            },
                        },
                    ],
                },
                {
                    type: DC_compTypes.Text_Display,
                    content: "# Immobilie",
                },
                {
                    type: DC_compTypes.Text_Display,
                    content: "-# Immobilien GmbH",
                },
                {
                    type: DC_compTypes.Separator,
                    spacing: 1,
                    divider: false,
                },
                {
                    type: DC_compTypes.Action_Row,
                    components: [
                        {
                            type: DC_compTypes.Button,
                            style: 1,
                            label: "25m²",
                            custom_id: 1,
                        },
                        {
                            type: DC_compTypes.Button,
                            label: "369€",
                            style: 1,
                            custom_id: 2,
                        },
                        {
                            type: DC_compTypes.Button,
                            style: 1,
                            label: "1 Raum",
                            custom_id: 3,
                        },
                    ],
                },
                {
                    type: DC_compTypes.Separator,
                    spacing: 1,
                },
                {
                    type: DC_compTypes.Action_Row,
                    components: [
                        {
                            type: DC_compTypes.Button,
                            style: 2,
                            label: "Gesundbrunnen",
                            custom_id: 4,
                        },
                        {
                            type: DC_compTypes.Button,
                            label: "Musterstraße 2",
                            style: 5,
                            url: "https://www.google.com/maps/place/Vogelherd%206,Halle+(Saale)",
                        },
                    ],
                },
                {
                    type: DC_compTypes.Separator,
                    spacing: 1,
                },
                {
                    type: DC_compTypes.Action_Row,
                    components: [
                        {
                            type: DC_compTypes.Button,
                            style: 2,
                            label: "Einbauküche",
                            custom_id: 5,
                            disabled: true,
                        },
                        {
                            type: DC_compTypes.Button,
                            style: 2,
                            label: "Balkon",
                            custom_id: 6,
                            disabled: true,
                        },
                        {
                            type: DC_compTypes.Button,
                            style: 2,
                            label: "Garten",
                            custom_id: 7,
                            disabled: true,
                        },
                    ],
                },
            ],
        },
    ],
};

const res = await fetch(url, {
    body: JSON.stringify(body),
    headers,
    method: "post",
});

console.log(res.statusText, await res.json());
