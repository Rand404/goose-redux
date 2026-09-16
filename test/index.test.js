const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const { getToken } = require('../auth');
const {
  HONK_VARIANTS,
  containsHonk,
  containsLetterH,
  randomInteger
} = require('../messageRules');
const { ensureHonkEmote, honkEmoteAsset } = require('../emote-upload');

function createGuild(emojis = []) {
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
        const emote = { name: options.name };
        emojis.push(emote);
        return emote;
      }
    },
    created
  };
}

test('loads and trims the token from auth.json data', () => {
  assert.equal(getToken({ token: '  secret-token  ' }), 'secret-token');
});

test('rejects missing or blank token values', () => {
  for (const auth of [undefined, {}, { token: '' }, { token: '   ' }]) {
    assert.throws(
      () => getToken(auth),
      /auth\.json must contain a non-empty "token" value/
    );
  }
});

test('recognizes every supported honk spelling case-insensitively', () => {
  for (const variant of HONK_VARIANTS) {
    assert.equal(containsHonk(`A ${variant.toUpperCase()} from the flock`), true);
  }
});

test('does not treat unrelated text as a honk', () => {
  assert.equal(containsHonk('The goose is resting'), false);
});

test('detects the letter h case-insensitively', () => {
  assert.equal(containsLetterH('A HONK'), true);
  assert.equal(containsLetterH('quack'), false);
});

test('generates an integer from one through the requested maximum', () => {
  assert.equal(randomInteger(2500, () => 0), 1);
  assert.equal(randomInteger(2500, () => 0.999999), 2500);
});

test('uploads the bundled honk emote when the guild does not have one', async () => {
  const guild = createGuild();

  const emote = await ensureHonkEmote(guild);

  assert.equal(emote.name, 'honk');
  assert.deepEqual(guild.created, [{
    attachment: honkEmoteAsset,
    name: 'honk'
  }]);
  assert.equal(fs.existsSync(honkEmoteAsset), true);
});

test('reuses an existing honk emote without uploading another', async () => {
  const existingEmote = { name: 'honk' };
  const guild = createGuild([existingEmote]);

  const emote = await ensureHonkEmote(guild);

  assert.equal(emote, existingEmote);
  assert.deepEqual(guild.created, []);
});
