const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const secretCtrl = require('./secret.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/secret - Create new secret */
  .post(validate(paramValidation.createSecret), secretCtrl.create);

router.route('/:hash')
  /** GET /api/secret/:hash - Get secret */
  .get(validate(paramValidation.getSecret), secretCtrl.get);


module.exports = router;
