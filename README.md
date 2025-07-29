<h1 align="center">Wohnungssucher</h1>

> [!NOTE]
> Ein self-hosted Webscraper für freie Wohnungen.
> [Zur Nutzung für Bildungszwecke](#Disclaimer)

<img width="748" height="837" alt="example" src="https://github.com/user-attachments/assets/0d8e6147-b960-4ff0-80a7-68e6a6257dd5" />

## Features

- **Self-hosted**: bare metal oder docker container
- **Benachrichtigungen**: E-Mail
- **Quellen**: 1

### Geplant

- Discord Benachrichtigungen
- automatische Bewerbung
- weiter Quellen

---

## Development

### Environment Variables

| Key           | Erklärung                | Beipiel             |
|---------------|--------------------------|---------------------|
| BUNDESLAND    | Bundesland nach URL      | nordrhein-westfalen |
| STADT         | Stadt nach URL           | koeln               |
| TOTALRENT     | Warmmiete in Euro        | 420                 |
| MAIL_RECEIVER | Empfänger E-Mail-Adresse | selbst@mail.de      |
| MAIL_ADDRESS  | Sender E-Mail-Adresse    | send@mail.de        |
| MAIL_PASS     | Sender E-Mail Passwort   | ********            |
| MAIL_HOST     | Host Domain              | smtp.host.de        |
| MAIL_PORT     | Sende Port               | 587                 |
| DEV           | Zeige Browserfenster     | 1                   |

## Disclaimer

Dieser Code ist zu Lern- und Demonstrationszwecken gedacht. Die Nutzung dieses
Codes für den Zugriff auf Webseiten sollte im Einklang mit den
Nutzungsbedingungen und geltendem Recht erfolgen. Der Autor übernimmt keine
Verantwortung für eventuellen Missbrauch.
