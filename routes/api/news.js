const express = require("express");

const ctrl = require("../../controllers/news-controllers");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/news");

const router = express.Router();

router.get("/", ctrl.getNews);

router.get(
  "/search",
  validateBody(schemas.getNewsByTitleSchema),
  ctrl.getNewsByTitle
);

module.exports = router;
