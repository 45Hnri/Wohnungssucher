import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { assertEnv } from "./helper";

const options: SMTPTransport.Options = {
    host: assertEnv("MAIL_HOST"),
    port: Number(assertEnv("MAIL_PORT")),
    from: assertEnv("MAIL_ADDRESS"),
    name: "Wohnungsfinder",
    secure: false,
    tls:
        Number(assertEnv("MAIL_PORT")) === 465
            ? {
                  ciphers: "SSLv3",
              }
            : undefined,
    auth: {
        user: assertEnv("MAIL_ADDRESS"),
        pass: assertEnv("MAIL_PASS"),
    },
};
export const transporter = nodemailer.createTransport(options);

export async function sendMail({
    subject,
    html,
}: {
    subject: string;
    html: string;
}) {
    await transporter.sendMail({
        from: {
            address: assertEnv("MAIL_ADDRESS"),
            name: "Wohnungsfinder",
        },
        to: assertEnv("MAIL_RECEIVER"),
        text: "aktiviere html",
        subject,
        html,
    });
}
