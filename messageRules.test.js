const test = require('node:test');
const assert = require('node:assert/strict');
const {
  HONK_VARIANTS,
  containsHonk,
  containsLetterH,
  randomInteger
} = require('./messageRules');

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
