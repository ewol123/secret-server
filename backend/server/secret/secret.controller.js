const secretService = require('./secret.service');

/**
 * Get secret
 * @property {string} req.params.hash - The hash of the string
 * @returns {Secret}
 */
async function get(req, res, next) {
  try {
    const secret = await secretService
    .get(req.params.hash.toString('base64'));
    if (secret) {
      return res.json({
        hash: secret.hash,
        secretText: secret.secretText,
        createdAt: secret.createdAt,
        expiresAt: secret.expiresAt || null,
        remainingViews: secret.remainingViews,
      });
    }
  } catch (e) {
    next(e);
  }
}

/**
 * Create new secret
 * @property {string} req.body.secret - This text that will be saved as a secret
 * @property {number} req.body.expireAfterViews - The secret won't be available
 * after the given number of views
 * @property {number} req.body.expireAfter - The secret won't be available after the given time.
 * The value is provided in minutes. 0 means never expires
 * @returns {Secret}
 */
async function create(req, res, next) {
  try {
    const savedSecret = await secretService
    .create({ ...req.body });

    if (savedSecret) {
      res.status(201);
      return res.json({
        hash: savedSecret.hash,
        secretText: req.body.secret,
        createdAt: savedSecret.createdAt,
        expiresAt: savedSecret.expiresAt || null,
        remainingViews: savedSecret.remainingViews,
      });
    }
  } catch (e) {
    next(e);
  }
}

module.exports = { get, create };
