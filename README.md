# Goose Redux

Goose Redux is a small Discord bot that reacts to messages with honks, daggers,
and the occasional verbal `HONK`.

## Features

- Reacts to honk variations with a `honk` emote, creating one automatically
  if the server lacks one.
- Occasionally reacts with a dagger or replies with `HONK`.

## Requirements

- Node.js 24 or later

The bot uses the `Guilds`, `GuildMessages`, `GuildMembers`, and
`MessageContent` gateway intents. Enable the privileged **Message Content**
intent in the Discord Developer Portal before starting the bot.

## Installation

### 1. Create the Discord application

1. Open the [Discord Developer Portal](https://discord.com/developers/applications)
   and select **New Application**.
2. Give the application a name and select **Create**.
3. Open the **Bot** page and select **Add Bot**, then confirm.
4. Under **Privileged Gateway Intents**, enable **Message Content Intent**.
   The bot uses this intent to inspect message text.
5. Select **Reset Token**, copy the new token, and keep it secret. You will
   not be able to view the full token again without resetting it.

### 2. Invite the bot to a server

1. Open **OAuth2 > URL Generator** in the Developer Portal.
2. Select the `bot` scope.
3. Grant the bot these permissions:
    - View Channels
    - Send Messages
    - Add Reactions
    - Manage Expressions
4. Copy the generated URL, open it in a browser, and select the server where
   you want to install the bot.

### 3. Clone and install the project

Clone the repository and install its dependencies:

```sh
git clone https://github.com/Rand404/goose-redux.git
cd goose-redux
npm install
```

### 4. Configure the bot

Create an `auth.json` file in the project root:

```json
{
  "token": "your-discord-bot-token"
}
```

The file is ignored by Git. Never commit your bot token or share it publicly.
If the file is missing or does not contain a token, the bot prints an error and
exits without attempting to connect to Discord.

### 5. Start the bot

Start the bot with:

```sh
npm start
```

When the bot connects successfully, it logs a startup message containing its
Discord username.

## Development

Run the test command with:

```sh
npm test
```

The project currently uses Node's built-in test runner. The bot entry point is
`index.js`.

## Project structure

```text
.
├── index.js
├── assets/
│   └── honk_emote.png
├── emote-upload.js
├── auth.js
├── messageRules.js
├── test/
│   └── index.test.js
├── package.json
├── package-lock.json
└── .gitignore
```

## Licence

This project is licensed under the MIT Licence. See the [LICENCE](LICENCE) file
for details.
