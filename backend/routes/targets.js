const express = require('express');
const router = express.Router();

const targetController = require('../controllers/target_controller');

router.get('/create-virtual-table',targetController.virtualTableCreation);

module.exports = router;