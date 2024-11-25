const express = require('express');
const router = express.Router();

const pseController = require('../controllers/pse_controller');

// Add route for checking remote sources
router.get('/check-pse-status', pseController.checkPSE);

module.exports = router;
