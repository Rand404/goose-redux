function getToken(auth) {
  if (!auth || typeof auth.token !== 'string' || !auth.token.trim()) {
    throw new Error('auth.json must contain a non-empty "token" value.');
  }

  return auth.token.trim();
}

module.exports = { getToken };
