const { Client, Events, GatewayIntentBits } = require('discord.js');
const colors = require('colors')  //Used for pretty aesthetic colours in console
const { getToken } = require('./auth');
const { ensureHonkEmote } = require('./emote-upload');
const { containsHonk, containsLetterH, randomInteger } = require('./messageRules');
const gooseFallback = '🪿';

function loadToken() {
  try {
    return getToken(require('./auth.json'));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('auth.json was not found. Create it with a "token" value.');
    }
    throw error;
  }
}

let token;
try {
  token = loadToken();
} catch (error) {
  console.error(`Unable to start bot: ${error.message}`);
  process.exitCode = 1;
}

if (token) {
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {
  console.log(`HONK HONK HONK ${c.user.tag}!`);
});

// Provision emotes for servers joined after startup.
client.on(Events.GuildCreate, guild => {
  ensureHonkEmote(guild).catch(error => {
    console.error(`Unable to create :honk: in ${guild.name}:`, error);
  });
});

client.on('messageCreate', message => {
  if (message.channel.type == "dm") return; //Rough fix for a bug in which the bot crashes upon being dm'd with a honk
  else if (containsHonk(message.content)) {  //Reacts to any message containing 'honk' or a number of set alternatives with the emote tied to :honk: - Also makes sure to be case insensitive
    const reactionEmote = message.guild.emojis.cache.find(emote => emote.name === 'honk');
    const reactWithHonk = async () => {
      try {
        await message.react(reactionEmote);
      } catch (error) {
        console.error(`Unable to react with :honk: in ${message.guild.name}:`, error);
        // Recreate a missing emote and retry this message once; no recursion prevents loops.
        try {
          const recoveredEmote = await ensureHonkEmote(message.guild);
          await message.react(recoveredEmote);
        } catch (recoveryError) {
          console.error(`Unable to recover :honk: in ${message.guild.name}:`, recoveryError);
          // Unicode goose is the final fallback when the custom emote is unavailable.
          try {
            await message.react(gooseFallback);
            console.log(`Message FailHonked in: ${message.guild.name} -> ${message.channel.name}`);
          } catch (fallbackError) {
            console.error(`Unable to react with the Unicode goose in ${message.guild.name}:`, fallbackError);
            return;
          }
        }
      }
      console.log(colors.blue(`Message Honked in: ${message.guild.name} -> ${message.channel.name}`));
    };
    reactWithHonk().catch(console.error);
  }
});

client.on('messageCreate', message => {     //The bot will react with a dagger emote when targeting = 10 on a particular message
  var targeting = randomInteger(2500);
  if (message.channel.type == "dm") return; 
  else if (targeting == 10) {
  message.react('🗡️')
    .then(console.log(colors.cyan(`DAGGER deployed in: ${message.guild.name} -> ${message.channel.name}`)))
    .catch(console.error);
} else {
    console.log(colors.red(targeting + ' DAGGER not deployed'));
}});

client.on('messageCreate', message => {   //On any message containing the letter 'h' the bot generates a number between 1 and 1000
  if (message.channel.type == "dm") return;
  else if(containsLetterH(message.content)) {
    var number = randomInteger(1000);
    if (number == 50) { //If that message is a 50 it triggers a special honk
      message.channel.send('HONK')
        .then(console.log(colors.green(`Verbal HONK deployed: ${message.guild.name} -> ${message.channel.name}`)))
        .catch(console.error);
  }  else {
      console.log(colors.red(number + ' Verbal HONK not deployed')); //On any other number it generates a console log and does nothing
    }
  }
});

client.login(token).catch(error => {
  console.error(`Unable to log in to Discord: ${error.message}`);
  process.exitCode = 1;
});
}
