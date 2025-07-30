import type { flatInfoItem } from "./types";

const style = `
            :root {
                --background: 0 0% 100%;
                --foreground: 240 10% 3.9%;

                --card: 0 0% 100%;
                --card-foreground: 240 10% 3.9%;

                --popover: 0 0% 100%;
                --popover-foreground: 240 10% 3.9%;

                --primary: 240 5.9% 10%;
                --primary-foreground: 0 0% 98%;

                --secondary: 240 4.8% 95.9%;
                --secondary-foreground: 240 5.9% 10%;

                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;

                --accent: 240 4.8% 95.9%;
                --accent-foreground: 240 5.9% 10%;

                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 0 0% 98%;

                --border: 240 5.9% 90%;
                --input: 240 5.9% 90%;
                --ring: 240 10% 3.9%;

                --radius: 0.5rem;
            }

            @media (prefers-color-scheme: dark) {
                .text-primary {
                    color: hsl(var(--primary)) !important;
                }
            }

            * {
                padding: 0;
                margin: 0;
            }

            body {
                display: flex;
                background-color: hsl(var(--muted));
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 3rem;
                width: 100%;
            }

            article {
                padding: 1rem;
                max-width: 400px;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            img {
                border: 1px solid hsl(var(--border));
                border-radius: 0.25rem;
                width: 100%;
            }

            .shadow {
                box-shadow:
                    0 1px 1px 0 rgb(0 0 0 / 0.1),
                    0 1px 1px -1px rgb(0 0 0 / 0.1);
            }

            .text-primary {
                color: hsl(var(--primary));
            }

            h1 {
                display: block; /* or inline-block */
                text-overflow: ellipsis;
                word-wrap: break-word;
                overflow: hidden;
                max-height: 3em;
                line-height: 1.5em;
                font-size: 1.25rem;
                font-weight: 600;
                color: hsl(var(--primary));
                text-decoration-color: hsl(var(--primary));
            }
            ul {
                list-style-type: none;
            }

            .text-muted-foreground {
                color: hsl(var(--muted-foreground));
            }
            .flex {
                display: flex;
            }
            .flex-col {
                flex-direction: column;
            }
            .items-center {
                align-items: center;
            }
            .items-end {
                align-items: end;
            }
            .justify-center {
                justify-content: center;
            }
            .justify-around {
                justify-content: space-around;
            }

            .text-xs {
                font-size: 0.5rem;
            }

            .text-sm {
                font-size: 0.75rem;
            }

            .text-lg {
                font-size: 1.25rem;
            }

            .self-center {
                justify-self: center;
                align-self: center;
            }

            .flex-1 {
                flex: 1 1 0%;
            }

            .border {
                border: 1px solid hsl(var(--border));
            }

            .border-r {
                border-right: 1px solid hsl(var(--border));
            }

            .rounded {
                border-radius: 0.25rem /* 4px */;
            }

            .rounded-full {
                border-radius: 9999px /* 12px */;
            }

            .p-3 {
                padding: 0.75rem /* 12px */;
            }

            .px-3 {
                padding: 0 0.75rem /* 12px */;
            }

            .px-4 {
                padding: 0 1rem /* 16px */;
            }

            .py-1\.5 {
                padding-top: 0.375rem /* 6px */;
                padding-bottom: 0.375rem /* 6px */;
            }

            .my-3 {
                margin-top: 0.75rem /* 12px */;
                margin-bottom: 0.75rem /* 12px */;
            }

            .bg-background {
                background-color: hsl(var(--background));
            }

            .gap-5 {
                gap: 1rem /* 16px */;
            }
`;

export function makeEmailHtml({
    title,
    items,
}: {
    title: string;
    items: flatInfoItem[];
}) {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
            ${style}
        </style>
    </head>
    <body>
        ${items
            .map(
                ({
                    image,
                    title,
                    company,
                    space,
                    totalRent,
                    id,
                    rooms,
                    street,
                    houseNumber,
                    tags,
                    quater,
                }) => `
        <article>
            <img
                class="shadow"
                src="${image[0] ?? ""}"
                alt="Wohnungsbild"
            />
            <a href="https://www.immobilienscout24.de/expose/${id}">
                <h1>${title}</h1>
            </a>
            <span class="text-muted-foreground">${company ?? "Anbieter unbekannt"}</span>
            <ul
                class="justify-around flex bg-background items-center border rounded shadow py-1.5 my-3"
            >
                <li class="flex flex-col flex-1 border-r px-4 py-1.5">
                    <label class="text-muted-foreground text-xs">Fläche</label>
                    <span class="text-lg self-center text-primary">${space ?? "-"}m²</span>
                </li>
                <li class="flex flex-col flex-1 border-r px-4 py-1.5">
                    <label class="text-muted-foreground text-xs">Preis</label>
                    <span class="text-lg self-center text-primary">${totalRent ?? "-"}€</span>
                </li>
                <li class="flex flex-col flex-1 px-4 py-1.5">
                    <label class="text-muted-foreground text-xs">Räume</label>
                    <span class="text-lg self-center text-primary">${rooms ?? "-"}</span>
                </li>
            </ul>
            <div class="flex justify-around items-center gap-5">
                <span class="flex-1">${quater ?? ""}</span>
                ${
                    street
                        ? `<a class="text-muted-foreground text-sm"
                        href="https://www.google.com/maps/place/${encodeURI(`${street} ${houseNumber ?? ""}`)},Halle+(Saale)"
                        >${street} ${houseNumber ?? "???"}</a>`
                        : ""
                }
            </div>
            <ul class="gap-5 flex items-center text-sm my-3">
                ${tags
                    .map(
                        (t) => `
                <li
                    class="flex flex-col px-4 py-1.5 shadow bg-background border rounded-full"
                >
                    <span class="self-center text-primary">${t}</span>
                </li>`,
                    )
                    .join("\n")}
            </ul>
        </article>
`,
            )
            .join("\n")}
    </body>
</html>
`;
}
