const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const { getToken } = require('./auth');
const {
  HONK_VARIANTS,
  containsHonk,
  containsLetterH,
  randomInteger
} = require('./messageRules');
const { ensureHonkEmote, honkEmoteAsset } = require('./emote-upload');

function createGuild(emojis = [], create = async options => {
  const emote = { name: options.name };
  emojis.push(emote);
  return emote;
}) {
  const created = [];
  return {
    id: 'test-guild',
    name: 'Test Guild',
    emojis: {
      cache: {
        find: predicate => emojis.find(predicate)
      },
      create: async options => {
        created.push(options);
        return create(options);
      }
    },
    created
  };
}

test('validates and normalises the bot token', () => {
  assert.equal(getToken({ token: '  secret-token  ' }), 'secret-token');

  for (const auth of [undefined, {}, { token: '' }, { token: '   ' }]) {
    assert.throws(
      () => getToken(auth),
      /auth\.json must contain a non-empty "token" value/
    );
  }
});

test('recognises supported honks and detects the letter h', () => {
  for (const variant of HONK_VARIANTS) {
    assert.equal(containsHonk(variant.toUpperCase()), true);
  }
  assert.equal(containsHonk('The goose is resting'), false);
  assert.equal(containsLetterH('A HONK'), true);
  assert.equal(containsLetterH('quack'), false);
});

test('generates integers within the requested range', () => {
  assert.equal(randomInteger(2500, () => 0), 1);
  assert.equal(randomInteger(2500, () => 0.999999), 2500);
});

test('creates the bundled honk emote when it is missing', async () => {
  const guild = createGuild();

  await assert.doesNotReject(async () => {
    const emote = await ensureHonkEmote(guild);
    assert.equal(emote.name, 'honk');
  });

  assert.deepEqual(guild.created, [{
    attachment: honkEmoteAsset,
    name: 'honk'
  }]);
  assert.equal(fs.existsSync(honkEmoteAsset), true);
});

test('reuses an existing honk emote without uploading another', async () => {
  const existingEmote = { name: 'honk' };
  const guild = createGuild([existingEmote]);

  await assert.doesNotReject(async () => {
    assert.equal(await ensureHonkEmote(guild), existingEmote);
  });

  assert.deepEqual(guild.created, []);
});

test('deduplicates concurrent honk emote uploads for a guild', async () => {
  let resolveCreation;
  const creation = new Promise(resolve => {
    resolveCreation = resolve;
  });
  const guild = createGuild([], () => creation);

  const firstUpload = ensureHonkEmote(guild);
  const secondUpload = ensureHonkEmote(guild);
  resolveCreation({ name: 'honk' });

  assert.equal(await firstUpload, await secondUpload);
  assert.equal(guild.created.length, 1);
});
