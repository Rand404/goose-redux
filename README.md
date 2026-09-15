# Goose Redux

Goose Redux is a small Discord bot that reacts to messages with honks, daggers,
and the occasional verbal `HONK`.

## Features

- Reacts to messages containing common variations of "honk" with the server's
  custom `honk` emoji.
- Has a 1-in-2,500 chance of reacting to any guild message with a dagger.
- Has a 1-in-1,000 chance of replying `HONK` to messages containing the letter
  `h`.
- Ignores direct messages.
- Prints colorful activity logs to the console.

## Requirements

- Node.js 20 or later
- A Discord application and bot token
- A Discord server where the bot can read messages, add reactions, and send
  messages

The bot uses the `Guilds`, `GuildMessages`, `GuildMembers`, and
`MessageContent` gateway intents. Enable the privileged **Message Content**
intent in the Discord Developer Portal before starting the bot.

## Installation

Clone the repository and install its dependencies:

```sh
git clone https://github.com/Rand404/goose-redux.git
cd goose-redux
npm install
```

## Configuration

Create an `auth.json` file in the project root:

```json
{
  "token": "your-discord-bot-token"
}
```

The file is ignored by Git. Never commit your bot token or share it publicly.

For the honk reaction, add a custom emoji named `honk` to the Discord server
where the bot is installed.

## Running the bot

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
├── messageRules.js
├── messageRules.test.js
├── package.json
├── package-lock.json
└── .gitignore
```

## License

This project currently uses the ISC license declared in `package.json`.
