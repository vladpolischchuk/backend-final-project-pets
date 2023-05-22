const express = require("express");

const router = express.Router();

const { validateBody } = require("../../utils/index");

const { authenticate, upload } = require("../../middlewares/index");

const {  registerShema, userInfoShema } = require('../../models/userSchema')

const {register, login, getCurrent, logout, updateAvatar, updateUser} = require("../../controllers/auth-controllers");

router.post('/register', validateBody(registerShema), register);

router.post("/login", validateBody(registerShema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.put("/user/:id", authenticate, validateBody(userInfoShema), updateUser)

router.put("/avatar/:id", authenticate, upload.single("avatarURL"), updateAvatar);

module.exports = router;