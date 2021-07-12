const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

// fix mongoose promise deprecation warning
mongoose.Promise = require('bluebird');

/**
 * Secret Schema
 */
const SecretSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    minLength: 1,
  },
  remainingViews: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false,
    default: null,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
SecretSchema.method({});

/**
 * Statics
 */
SecretSchema.statics = {
  /**
   * Get secret and decrement its remainingViews property in a race condition safe way
   * @param {String} hash - The hash of the secret.
   * @returns {Promise<Secret, APIError>}
   */
  async getByHash(hash) {
    // 1. rule: only return secrets with remaining views.
    const hasViewsRemaining = { remainingViews: { $gt: 0 } };

    // 2. rule: only return not expired secrets.
    const notExpired = {
      $or: [
        { expiresAt: { $gte: new Date().toISOString() } },
        { expiresAt: null },
      ],
    };

    // it's really important to update the views in an atomic way.
    // if we would do this from javascript we could have a race
    // condition in case multiple requests hit the API at the SAME time.
    const valueToUpdate = { $inc: { remainingViews: -1 } };

    const secret = await this.findOneAndUpdate(
      {
        $and: [{ hash }, hasViewsRemaining, notExpired],
      },
      valueToUpdate,
      { new: true }
    ).exec();
    if (secret) {
      return secret;
    }
    const err = new APIError('No such secret exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  },
};

/**
 * @typedef Secret
 */
module.exports = mongoose.model('Secret', SecretSchema);
