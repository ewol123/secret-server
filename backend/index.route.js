const express = require('express');
const secretRoutes = require('./server/secret/secret.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount secret routes at /secret
router.use('/secret', secretRoutes);

module.exports = router;
