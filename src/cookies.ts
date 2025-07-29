import type { CookieData } from "puppeteer";

export const IS24_consent: CookieData = {
    name: "consent_status",
    value: "false",
    domain: ".immobilienscout24.de",
    path: "/",
    sameParty: false,
    expires: -1,
    httpOnly: false,
    secure: false,
    sourceScheme: "NonSecure",
};
