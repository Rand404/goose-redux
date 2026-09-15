const path = require('node:path');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const colors = require('colors')  //Used for pretty aesthetic colours in console
const { getToken } = require('./auth');
const { containsHonk, containsLetterH, randomInteger } = require('./messageRules');

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
const honkEmoteAsset = path.join(__dirname, 'assets', 'honk_emote.png');
const honkEmoteCreations = new Map();

function ensureHonkEmote(guild) {
  const existingEmote = guild.emojis.cache.find(emote => emote.name === 'honk');
  if (existingEmote) return existingEmote;

  const pendingCreation = honkEmoteCreations.get(guild.id);
  if (pendingCreation) return pendingCreation;

  const creation = guild.emojis.create({
    attachment: honkEmoteAsset,
    name: 'honk'
  }).then(emote => {
    console.log(colors.green(`Created :honk: in ${guild.name}`));
    return emote;
  }).finally(() => {
    honkEmoteCreations.delete(guild.id);
  });
  honkEmoteCreations.set(guild.id, creation);
  return creation;
}

client.once(Events.ClientReady, async c => {
  console.log(`HONK HONK HONK ${c.user.tag}!`);
  await Promise.all(c.guilds.cache.map(guild =>
    ensureHonkEmote(guild).catch(error => {
      console.error(`Unable to create :honk: in ${guild.name}:`, error);
    })
  ));
});

client.on(Events.GuildCreate, guild => {
  ensureHonkEmote(guild).catch(error => {
    console.error(`Unable to create :honk: in ${guild.name}:`, error);
  });
});

client.on('messageCreate', message => {
  if (message.channel.type == "dm") return; //Rough fix for a bug in which the bot crashes upon being dm'd with a honk
  else if (containsHonk(message.content)) {  //Reacts to any message containing 'honk' or a number of set alternatives with the emote tied to :honk: - Also makes sure to be case insensitive
    const reactionEmote = message.guild.emojis.cache.find(emote => emote.name === 'honk');
    if (!reactionEmote) {
      console.error(`Unable to react with :honk: in ${message.guild.name}: emote is not available`);
      return;
    }
    message.react(reactionEmote)
      .then(console.log(colors.blue(`Message Honked in: ${message.guild.name} -> ${message.channel.name}`)))
      .catch(console.error);
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
