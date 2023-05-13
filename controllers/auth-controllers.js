const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const {   User,
  registerShema,
  userInfoShema, } = require("../models/user");

const { HttpError } = require("../utils/index");

const { SECRET_KEY } = process.env;
// const jimp = require("jimp");


const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const { error } = registerShema.validate(req.body);
    console.log(error)
    const { email, password } = req.body;

    if (error) {
      throw HttpError(400, "Помилка від Joi або іншої бібліотеки валідації");
    }

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email);

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      email: result.email,

    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = registerShema.validate(req.body);
    const { email, password } = req.body;
    if (error) {
      throw HttpError(400, "Помилка від Joi або іншої бібліотеки валідації");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, name, birthDate, avatarURL, city, birthday, phone } = req.user;
    res.json({
      email, name, birthDate, avatarURL, city, phone, birthday
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { error } = registerShema.validate(req.body);
    if (error) {
      throw HttpError(400, "Помилка від Joi або іншої бібліотеки валідації");
    }
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async(req, res, next) => {
  try {
    const { error } = userInfoShema.validate(req.body);
    console.log(error)
    if (error) {
      throw HttpError(400, "Помилка від Joi або іншої бібліотеки валідації");
    }
    const { id } = req.user;
    const result = await User.findByIdAndUpdate(id, req.body)
    res.json(result);
  } catch (error) {
    next(error);
  }
}
const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`;

    jimp
      .read(`./temp/${filename}`)
      .then((img) => {
        return img.resize(250, 250).write(`./public/avatars/${avatarName}`);
      })
      .catch((err) => {
        console.log(err);
      });

    const resultUpload = path.join(avatarsDir, avatarName);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", avatarName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrent,
  register,
  login,
  logout,
  updateUser,
  updateAvatar,
};