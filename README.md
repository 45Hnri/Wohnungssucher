<h1 align="center">Wohnungssucher</h1>

> [!INFO]
> Ein self-hosted Webscraper für freie Wohnungen.
> [[#Disclaimer|Zur Nutzung für Bildungszwecke]]

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
