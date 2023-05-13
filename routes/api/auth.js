const express = require("express");

const router = express.Router();

const { authenticate, upload } = require("../../middlewares/index");

const {register, login, getCurrent, logout, updateAvatar, updateUser} = require("../../controllers/auth-controllers");

router.post('/register', register);

router.post("/login", login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar)

router.put("/:id", authenticate, updateUser)

module.exports = router;