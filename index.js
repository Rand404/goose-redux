const { Client, Events, GatewayIntentBits } = require('discord.js');
const colors = require('colors')  //Used for pretty aesthetic colours in console
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });
const auth = require('./auth.json');
const { containsHonk, containsLetterH, randomInteger } = require('./messageRules');

client.once(Events.ClientReady, c => {
  console.log(`HONK HONK HONK ${c.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.channel.type == "dm") return; //Rough fix for a bug in which the bot crashes upon being dm'd with a honk
  else if (containsHonk(message.content)) {  //Reacts to any message containing 'honk' or a number of set alternatives with the emoji tied to :honk: - Also makes sure to be case insensitive
    const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'honk');
  message.react(reactionEmoji)
      .then(console.log(colors.blue(`Message Honked in: ${message.guild.name} -> ${message.channel.name}`)))
      .catch(console.error);
} 
});

client.on('messageCreate', message => {     //The bot will react with a dagger emoji when targeting = 10 on a particular message
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

client.login(auth.token);
