const test = require('node:test');
const assert = require('node:assert/strict');
const { getToken } = require('./auth');

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
