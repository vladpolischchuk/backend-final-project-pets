const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { Users } = require("../models/userSchema");

const { HttpError, ctrlWrapper } = require("../utils/index");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);

  let token;

  const result = await Users.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const loginUserafterRegister = async (req, res) => {
    const user = await Users.findOne({ email });

    const payload = {
      id: user._id,
    };

    token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    await Users.findByIdAndUpdate(user._id, { token });
  };

  await loginUserafterRegister();

  res.status(201).json({
    email: result.email,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
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

  await Users.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user,
  });
};

const getCurrent = async (req, res) => {
  const { email, name, avatarURL, city, birthday, phone, id } = req.user;
  res.json({
    email,
    name,
    avatarURL,
    city,
    phone,
    birthday,
    id,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await Users.findByIdAndUpdate(_id, { token: "" });

  res.status(201).json({
    message: "Logout success",
  });
};

const updateUser = async (req, res) => {
  const { id } = req.user;

  await Users.findByIdAndUpdate(id, req.body);
  let infoUser;
  const getCurrentInfo = async (res, req) => {
    infoUser = await Users.findById(id);
  };
  await getCurrentInfo();
  res.json(infoUser);
};

const updateAvatar = async (req, res) => {
  const { id } = req.user;

  await Users.findByIdAndUpdate(id, { avatarURL: req.file.path });

  let newAvatar;
  const getCurrentInfo = async (res, req) => {
    newAvatar = await Users.findById(id);
  };
  await getCurrentInfo();

  res.json(newAvatar);
};
module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
