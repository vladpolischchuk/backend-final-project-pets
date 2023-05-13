const express = require("express");

const ctrl = require("../../controllers/friends-controllers");

const router = express.Router();

router.get("/", ctrl.getFriends);

module.exports = router;
