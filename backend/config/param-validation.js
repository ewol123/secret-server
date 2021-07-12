const Joi = require('joi');

module.exports = {
  // POST /api/secret
  createSecret: {
    body: {
      secret: Joi.string().required(),
      expireAfterViews: Joi.number().integer().min(1).required(),
      expireAfter: Joi.number().integer().min(0).required()
    }
  },

  // GET /api/secret/:hash
  getSecret: {
    params: {
      hash: Joi.string().hex().required()
    }
  },

};
