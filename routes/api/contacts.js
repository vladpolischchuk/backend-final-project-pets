const express = require("express");

const ctrl = require("../../controllers/controllers");

const { validateBody } = require("../../utils/index");

const { authenticate } = require("../../middlewares/index");

const {
  addSchema,
  updateFavoriteSchema
} = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, ctrl.getById);

router.post("/", authenticate, validateBody(addSchema), ctrl.getAdd);

router.delete("/:contactId", authenticate, ctrl.getRemove);

router.put("/:contactId", authenticate, validateBody(addSchema), ctrl.getUpdate);

router.patch("/:contactId/favorite", authenticate, validateBody(updateFavoriteSchema), ctrl.getFavorite);


module.exports = router;