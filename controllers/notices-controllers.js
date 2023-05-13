const { ctrlWrapper } = require("../utils");

const { Notices } = require("../models/notice");

const { HttpError } = require("../utils");

const addNotices = async (req, res) => {
  const result = await Notices.create(req.body);
  res.status(201).json(result);
};

const getAllNotices = async (req, res) => {
  const result = await Notices.find();
  res.json(result);
};

module.exports = {
  getAllNotices: ctrlWrapper(getAllNotices),
  addNotices: ctrlWrapper(addNotices),
};
