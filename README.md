<h1 align="center">Wohnungssucher</h1>

> [!NOTE]
> Ein self-hosted Webscraper für freie Wohnungen.
> [Zur Nutzung für Bildungszwecke](#Disclaimer)

<img width="748" height="837" alt="example" src="https://github.com/user-attachments/assets/0d8e6147-b960-4ff0-80a7-68e6a6257dd5" />

## Features

- **Self-hosted**: bare metal oder docker container
- **VPN-Support**: docker compose mit openvpn
- **Benachrichtigungen**: E-Mail, Discord Bot
- **Quellen**: 1

### Geplant

- Wireguard VPN-Support
- automatische Bewerbung
- weiter Quellen

---

## Development

### Environment Variables

| Key                  | Erklärung                    | Beipiel             |
|----------------------|------------------------------|---------------------|
| BUNDESLAND           | Bundesland nach URL          | nordrhein-westfalen |
| STADT                | Stadt nach URL               | koeln               |
| TOTALRENT            | Warmmiete in Euro            | 420                 |
| MAIL_RECEIVER        | Empfänger E-Mail-Adresse     | selbst@mail.de      |
| MAIL_ADDRESS         | Sender E-Mail-Adresse        | send@mail.de        |
| MAIL_PASS            | Sender E-Mail Passwort       | ********            |
| MAIL_HOST            | Host Domain                  | smtp.host.de        |
| MAIL_PORT            | Sende Port                   | 587                 |
| DEV                  | Zeige Browserfenster         | 1                   |
| TZ                   | eigene Zeitzone              | Europe/Berlin       |
| VPN_SERVICE_PROVIDER | VPN Anbieter                 | mullvad             |
| VPN_TYPE             | VPN Service                  | openvpn             |
| OPENVPN_USER         | OVPN Nutzername              | 20934239203840293   |
| OPENVPN_PASSWORD     | OVPN Passwort                | m                   |
| SERVER_COUNTRIES     | VPN Länderliste              | Germany             |
| DISCORD_CHANNEL_ID   | ID des Server Channels       | 1400112119283429992 |
| DISCORD_BOT_TOKEN    | Token in eigener Discord-App | MTQwMDExtwe...      |

## Disclaimer

Dieser Code ist zu Lern- und Demonstrationszwecken gedacht. Die Nutzung dieses
Codes für den Zugriff auf Webseiten sollte im Einklang mit den
Nutzungsbedingungen und geltendem Recht erfolgen. Der Autor übernimmt keine
Verantwortung für eventuellen Missbrauch.
