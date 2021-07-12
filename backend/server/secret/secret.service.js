const Secret = require('./secret.model');
const { decrypt, encrypt, toBase64, toHex } = require('../helpers/encriptify');

/**
 * Get secret
 * @property {string} hash - hex encoded hash string
 * @returns {Secret}
 */
async function get(hash) {
  const model = await Secret.getByHash(toBase64(hash));

  const decryptOutput = decrypt(model.hash);

  model.secretText = decryptOutput;
  model.hash = hash;

  return model;
}

/**
 * Create new secret
 * @property {string} secret - This text that will be saved as a secret
 * @property {string} expireAfterViews - The secret won't be available
 * after the given number of views
 * @property {number} expireAfter - The secret won't be available after the given time.
 * The value is provided in minutes. 0 means never expires
 * @returns {Secret}
 */
async function create({ secret, expireAfterViews, expireAfter }) {
  const form = {
    hash: encrypt(secret),
    remainingViews: expireAfterViews,
  };

  if (expireAfter) {
    form.expiresAt = new Date(
      new Date().getTime() + (expireAfter * 60000)
    ).toISOString();
  }

  const model = new Secret(form);
  const result = await model.save();

  // we store the hash in base64 because it's more efficient,
  // but we return it as a hex string since that is more url friendly.
  result.hash = toHex(result.hash);
  return result;
}

module.exports = { get, create };
