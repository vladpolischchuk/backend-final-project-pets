const express = require("express");

const ctrl = require("../../controllers/notices-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/notice");

const router = express.Router();

router.get("/", ctrl.getAllNotices);

router.post("/", validateBody(schemas.addNoticeSchema), ctrl.addNotices);

router.get(
  "/categories",
  validateBody(schemas.getCategorySchema),
  ctrl.getNoticesByCategory
);

router.get(
  "/search",
  validateBody(schemas.getNoticesByTitleSchema),
  ctrl.getNoticesByTitle
);

router.get("/:id", ctrl.getOneNotice);

module.exports = router;
