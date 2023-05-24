const express = require("express");

const ctrl = require("../../controllers/pets-controllers");

const { authenticate, cloudinary } = require("../../middlewares/index");

const router = express.Router();

router.post("/create", authenticate, cloudinary.single("photo"), ctrl.addPet);

router.delete("/:petId", authenticate, ctrl.removePet);

router.get("/all", authenticate, ctrl.getAllPets);

module.exports = router;
