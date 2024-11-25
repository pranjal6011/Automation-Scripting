const express = require("express");
const router = express.Router();

console.log("Router loaded");
router.use('/source', require('./sources'));
router.use('/target', require('./targets'));
router.use('/remote', require('./remotes'));
router.use('/pse', require('./pses'));

module.exports = router;