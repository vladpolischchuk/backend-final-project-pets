const express = require("express");

const ctrl = require("../../controllers/notices-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/notice");

const router = express.Router();

router.post("/", validateBody(schemas.addNoticeSchema), ctrl.addNotices);

router.get("/all", ctrl.getAllNotices);

router.get("/search", ctrl.getNoticesByTitle);

router.get("/:category", ctrl.getNoticesByCategory);

// router.get(
//   "/:categoriesName",
//   validateBody(schemas.getCategorySchema),
//   ctrl.getNoticesByCategory
// );

router.get("/id/:id", ctrl.getOneNotice);

module.exports = router;
