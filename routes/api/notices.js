const express = require("express");

const ctrl = require("../../controllers/notices-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/notice");

const router = express.Router();

router.post("/", validateBody(schemas.addNoticeSchema), ctrl.addNotices);

router.get("/", ctrl.getAllNotices);

module.exports = router;
