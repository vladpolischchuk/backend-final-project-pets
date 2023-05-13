const { ctrlWrapper } = require("../utils");

const { Notices } = require("../models/notice");

const { HttpError } = require("../utils");

const getAllNotices = async (req, res) => {
  const result = await Notices.find();
  res.json(result);
};

const addNotices = async (req, res) => {
  const result = await Notices.create(req.body);
  res.status(201).json(result);
};

const getNoticesByTitle = async (req, res) => {
  const { title, category } = req.body;

  if (!title) {
    throw HttpError(404, "Title not selected");
  }

  const optimizerTitle = new RegExp(title, "i");
  const result = await Notices.find({ title: optimizerTitle, category });

  if (result.length === 0) {
    throw HttpError(404, "Title not found");
  }

  res.json(result);
};

module.exports = {
  getAllNotices: ctrlWrapper(getAllNotices),
  addNotices: ctrlWrapper(addNotices),
  getNoticesByTitle: ctrlWrapper(getNoticesByTitle),
};
