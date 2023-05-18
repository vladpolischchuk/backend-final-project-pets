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
  const { page, limit, title } = req.query;

  const skip = (page - 1) * limit;

  if (!title) {
    throw HttpError(404, "Title not selected");
  }

  const optimizerTitle = new RegExp(title, "i");
  const result = await Notices.find(
    { title: optimizerTitle },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  );

  if (result.length === 0) {
    throw HttpError(404, "Title not found");
  }

  res.json(result);
};

const getNoticesByCategory = async (req, res) => {
  const { category } = req.params;
  const { page, limit, title } = req.query;

  const skip = (page - 1) * limit;

  const result = await Notices.find(
    title ? { category, title } : { category },

    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  );

  if (!result) {
    throw HttpError(404, `Notice with ${category} or ${title} not found`);
  }

  res.json(result);
};

const getOneNotice = async (req, res) => {
  const { id } = req.params;

  const result = await Notices.findById(id);

  if (!result) {
    throw HttpError(404, `Notice with ${id} not found`);
  }

  res.json(result);
};

module.exports = {
  getAllNotices: ctrlWrapper(getAllNotices),
  addNotices: ctrlWrapper(addNotices),
  getNoticesByTitle: ctrlWrapper(getNoticesByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getOneNotice: ctrlWrapper(getOneNotice),
};
