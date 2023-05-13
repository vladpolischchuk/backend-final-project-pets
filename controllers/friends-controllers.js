const { Friends } = require("../models/friends");

const { ctrlWrapper } = require("../utils");

const getFriends = async (req, res) => {
  const result = await Friends.find();

  res.json(result);
};

module.exports = {
  getFriends: ctrlWrapper(getFriends),
};
