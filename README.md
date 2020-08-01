<h1 align="center">
    <img src="everyone-bot-logo.png" alt="Everyone bot logo" width="200">
    <br>
    Everyone Bot
</h1>

> Telegram bot to get everyone's attention in a group chat. Like `@everyone` in other messaging applications.

## Use

Use the hosted bot, or host your own!

[Add to your group](https://telegram.me/everyonethebot)

Commands:

```
/start - Display help text
/in - Opt-in to receive mentions
/out - Opt-out of receiving mentions
/everyone - Mention all opted-in users
/clean - Admin-only command to clean up inactive users
```

## Installation

-   Clone the repository
-   Run `npm install -g yarn` if you haven't got yarn installed globally.
-   Run `yarn install` in the repository to install dependencies.
-   Create a config.json based on `config-sample.json` with the desired settings or setup the environment variables mentioned below.
-   Run `npm start` or `npm start:dev` to start the service.

## Environment Variables

| Name                                   | Description                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| TELEGRAM_API_KEY                       | API key for the telegram bot, provided by [@BotFather](https://telegram.me/BotFather)                                    |
| BOT_USERNAME                           | Username of the live bot on Telegram. Must be without the @ sign.                                                        |
| FIREBASE_PROJECT_NAME                  | Firebase project to be used for storage of groups & users.                                                               |
| FIREBASE_DATABASE_SECRET               | Auth secret for Firebase to communicate securely.                                                                        |
| MENTIONS_PER_MESSAGE                   | Used to chunk the mentions into multiple messages as Telegram doesn't notify the people mentioned after the first 4 - 5. |
| ENABLE_REMOVE_INACTIVE_MEMBERS_COMMAND | Enables the experimental admin-only /clean command                                                                       |

## License

[MIT &copy; Aquib Master](./LICENSE.md)
