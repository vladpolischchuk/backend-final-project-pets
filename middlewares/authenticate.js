const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Users } = require("../models/userSchema");

const { HttpError } = require("../utils/index");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await Users.findById(id);
    if (!user || !user.token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};
module.exports = authenticate;
