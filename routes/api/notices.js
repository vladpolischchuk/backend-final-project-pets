const express = require("express");

const ctrl = require("../../controllers/notices-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/notice");

const { authenticate, cloudinary } = require("../../middlewares/index");

const router = express.Router();

// Авторизированный пользователь

router.get("/user", authenticate, ctrl.getNoticesByOwner);

router.post("/", authenticate, cloudinary.single("photo"), ctrl.addNotices);

router.delete("/delete/:id", authenticate, ctrl.deleteNotice);

// Дефолт

router.get("/id/:id", ctrl.getOneNotice);

router.get("/all", ctrl.getAllNotices);

router.get("/search", ctrl.getNoticesByTitle);

router.get("/:category", ctrl.getNoticesByCategory);

module.exports = router;
