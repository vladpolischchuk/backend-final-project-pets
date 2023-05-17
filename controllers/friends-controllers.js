const { Friends } = require("../models/friends");

const { ctrlWrapper } = require("../utils");

const getFriends = async (req, res) => {
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  const result = await Friends.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.json(result);
};

module.exports = {
  getFriends: ctrlWrapper(getFriends),
};
