const express = require('express');
const router = express.Router();

const authController = require('../controllers/authenticate');

// Add route for checking remote sources
router.post('/validate-credentials', authController.validate);

module.exports = router;