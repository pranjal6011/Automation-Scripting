const express = require('express');
const router = express.Router();

const remoteController = require('../controllers/remote_controller');

// Add route for checking remote sources
router.post('/get-remote-sources', remoteController.getRemoteSources);
router.post('/check_remote_sources', remoteController.checkRemoteSources);

module.exports = router;
