import type { flatInfoItem } from "./types";

export function makeEmailHtml({
    title,
    items,
}: {
    title: string;
    items: flatInfoItem[];
}) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
        </head>
        <body style="background-color: #f5f5f5; margin: 0; padding: 0 0;">
            <table align="center" width="100%" cellpadding="0" cellspacing="40" style="">
            ${items
                .map(
                    ({
                        image,
                        title,
                        company,
                        space,
                        totalRent,
                        rent,
                        rooms,
                        street,
                        houseNumber,
                        tags,
                        quater,
                        link,
                    }) => `
                <tr>
                    <td align="center">
                        <table width="400" cellpadding="0" cellspacing="0" style="padding: 16px; border-collapse: collapse;">
                            <tr>
                                <td>
                                    <img
                                        src="${image[0] ?? ""}"
                                        alt="Wohnung Bild"
                                        style="width: 100%; border: 1px solid #e4e4e7; border-radius: 4px; display: block; box-shadow: 0 1px 1px 0 rgb(0 0 0 / 0.1), 0 1px 1px -1px rgb(0 0 0 / 0.1);"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top: 12px;">
                                    <a href="${link}"
                                        style="text-decoration: underline; color: #1f1f1f; font-size: 20px; font-weight: bold; font-family: sans-serif; display: block;"
                                    >
                                        ${title}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #737373; font-family: sans-serif; font-size: 14px; padding-top: 4px;">
                                    ${company ?? "Anbieter unbekannt"}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e4e4e7; border-radius: 4px; background-color: #ffffff; box-shadow: 0 1px 1px 0 rgb(0 0 0 / 0.1), 0 1px 1px -1px rgb(0 0 0 / 0.1);">
                                        <tr>
                                            <td align="center" style="border-right: 1px solid #e4e4e7; padding: 8px;">
                                                <div style="font-size: 10px; color: #737373; text-align: left">Fläche</div>
                                                <div style="font-size: 20px;">${space ?? "-"}m²</div>
                                            </td>
                                            <td align="center" style="border-right: 1px solid #e4e4e7; padding: 8px;">
                                                <div style="font-size: 10px; color: #737373; text-align: left">Preis</div>
                                                <div style="font-size: 20px;">${totalRent ?? rent ?? "-"}€ ${!totalRent && rent ? " + NK" : ""}</div>
                                            </td>
                                            <td align="center" style="padding: 8px;">
                                                <div style="font-size: 10px; color: #737373; text-align: left">Räume</div>
                                                <div style="font-size: 20px;">${rooms ?? "-"}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="font-family: sans-serif; font-size: 14px; color: #1f1f1f;">${quater ?? ""}</td>
                                            ${
                                                street
                                                    ? `<td align="right">
                                                    <a href="https://www.google.com/maps/place/${encodeURI(`${street} ${houseNumber ?? ""}`)},Halle+(Saale)"
                                                        style="font-size: 12px; color: #737373; text-decoration: underline; font-family: sans-serif;">
                                                        ${street} ${houseNumber ?? "???"}
                                                    </a>
                                                </td>`
                                                    : ""
                                            }
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0;">
                                    <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                        <tr>
                                            ${
                                                tags
                                                    .map(
                                                        (
                                                            t,
                                                        ) => `<td style="padding: 6px 12px; border: 1px solid #e4e4e7; background-color: #ffffff; border-radius: 24px; font-family: sans-serif; font-size: 12px; color: #1f1f1f; text-align: center; box-shadow: 0 1px 1px 0 rgb(0 0 0 / 0.1), 0 1px 1px -1px rgb(0 0 0 / 0.1);">
                                                        ${t}
                                                        </td> `,
                                                    )
                                                    .join(
                                                        '<td style="width: 10px;"></td>',
                                                    ) +
                                                Array(4)
                                                    .fill(
                                                        '<td style="width: 20%;"></td>',
                                                    )
                                                    .slice(0, 4 - tags.length)
                                                    .join("")
                                            }
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                `,
                )
                .join("\n")}
            </table>
        </body>
    </html>
    `;
}
