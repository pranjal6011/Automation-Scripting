

const express = require('express');
const router = express.Router();

const sourceController = require('../controllers/source_controller');

router.get('/create-source-table',sourceController.sourceCreation);

module.exports = router;