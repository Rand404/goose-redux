const path = require('node:path');

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
    console.log(`Created :honk: in ${guild.name}`);
    return emote;
  }).finally(() => {
    honkEmoteCreations.delete(guild.id);
  });
  honkEmoteCreations.set(guild.id, creation);
  return creation;
}

module.exports = { ensureHonkEmote, honkEmoteAsset };
