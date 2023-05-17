const express = require("express");

const ctrl = require("../../controllers/pets-controllers");

const { validateBody } = require("../../utils/index");

const { authenticate, cloudinary } = require("../../middlewares/index"); 

const { petJoiSchema } = require("../../models/pets");

const router = express.Router();

router.post("/create", authenticate, validateBody(petJoiSchema), cloudinary.single('photo'), ctrl.addPet);

router.delete("/:petId", authenticate, validateBody(petJoiSchema), ctrl.removePet);

router.get("/all", authenticate,  ctrl.getAllPets);

module.exports = router;