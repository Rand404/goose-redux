const { Client, Events, GatewayIntentBits } = require('discord.js');
const { getToken } = require('./auth');
const { ensureHonkEmote } = require('./emote-upload');
const { containsHonk, containsLetterH, randomInteger } = require('./messageRules');
const { debug, logError, logEvent } = require('./logger');
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
  logError('start bot', error, {
    fix: 'Create auth.json with a non-empty "token" value'
  });
  process.exitCode = 1;
}

if (token) {
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, c => {
  logEvent(`Connected as ${c.user.tag}`);
});

// Provision emotes for servers joined after startup.
client.on(Events.GuildCreate, guild => {
  ensureHonkEmote(guild).catch(error => {
    logError('create :honk:', error, {
      guild,
      fix: 'Grant Manage Expressions to the bot'
    });
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
        // Recreate a missing emote and retry this message once; no recursion prevents loops.
        try {
          const recoveredEmote = await ensureHonkEmote(message.guild);
          await message.react(recoveredEmote);
          logEvent('WARN custom :honk: reaction failed; recreated emote and retried', message.guild, message.channel, 'warn');
        } catch {
          // Unicode goose is the final fallback when the custom emote is unavailable.
          try {
            await message.react(gooseFallback);
            logEvent('WARN custom :honk: unavailable; reacted with Unicode goose', message.guild, message.channel, 'warn');
          } catch (fallbackError) {
            logError('react with Unicode goose', fallbackError, {
              guild: message.guild,
              channel: message.channel,
              messageId: message.id,
              fix: 'Grant Add Reactions in this channel'
            });
            return;
          }
        }
      }
      logEvent('HONK reacted', message.guild, message.channel, 'success');
    };
    reactWithHonk().catch(error => logError('react to message', error, {
      guild: message.guild,
      channel: message.channel,
      messageId: message.id,
      fix: 'Grant Add Reactions in this channel'
    }));
  }
});

client.on('messageCreate', message => {     //The bot will react with a dagger emote when targeting = 10 on a particular message
  var targeting = randomInteger(2500);
  if (message.channel.type == "dm") return; 
  else if (targeting == 10) {
  message.react('🗡️')
    .then(() => logEvent('DAGGER deployed', message.guild, message.channel, 'success'))
    .catch(error => logError('deploy dagger', error, {
      guild: message.guild,
      channel: message.channel,
      messageId: message.id,
      fix: 'Grant Add Reactions in this channel'
    }));
} else {
    debug(`DAGGER not deployed (roll=${targeting})`, message.guild, message.channel);
}});

client.on('messageCreate', message => {   //On any message containing the letter 'h' the bot generates a number between 1 and 1000
  if (message.channel.type == "dm") return;
  else if(containsLetterH(message.content)) {
    var number = randomInteger(1000);
    if (number == 50) { //If that message is a 50 it triggers a special honk
      message.channel.send('HONK')
        .then(() => logEvent('VERBAL HONK sent', message.guild, message.channel, 'success'))
        .catch(error => logError('send verbal HONK', error, {
          guild: message.guild,
          channel: message.channel,
          messageId: message.id,
          fix: 'Grant Send Messages in this channel'
        }));
  }  else {
      debug(`VERBAL HONK not sent (roll=${number})`, message.guild, message.channel);
    }
  }
});

client.login(token).catch(error => {
  logError('log in to Discord', error, {
    fix: 'Check auth.json and regenerate the bot token if needed'
  });
  process.exitCode = 1;
});
}
