const express = require('express');
const router = express.Router();

const remoteController = require('../controllers/remote_controller');

// Add route for checking remote sources
router.get('/check-remote-sources', remoteController.checkRemote);

module.exports = router;
