const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../utils/index");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email);
    console.log(req.body)
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      email: result.email,

    });
};

const login = async (req, res) => {

    const { email, password } = req.body;
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
};

const getCurrent = async (req, res) => {
    const { email, name, birthDate, avatarURL, city, birthday, phone } = req.user;
    res.json({
      email, name, birthDate, avatarURL, city, phone, birthday
    });

};

const logout = async (req, res) => {

    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
      message: "Logout success",
    });
};

const updateUser = async(req, res) => {
    const {id} = req.user;
    console.log(req.body)
    const result = await User.findByIdAndUpdate(id, req.body)
    res.json(result);
}

const updateAvatar = async (req, res) => {
  const {id} = req.user;

 const newAvatar = await User.findByIdAndUpdate(id, {avatarURL: req.file.path});

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