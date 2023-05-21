const { ctrlWrapper } = require("../utils");

const { Notices } = require("../models/notice");

const { HttpError } = require("../utils");

const getAllNotices = async (req, res) => {
  const result = await Notices.find();
  res.json(result);
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

  const resultAll = await Notices.find(
    title ? { category, title } : { category }
  );

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

  res.json({ result, total: resultAll.length });
};

const getOneNotice = async (req, res) => {
  const { id } = req.params;

  const result = await Notices.findById(id);

  if (!result) {
    throw HttpError(404, `Notice with ${id} not found`);
  }

  res.json(result);
};

// Пользователь авторизован

const addNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const noticesData = req.body;

  const data = !!req.file
    ? { photo: req.file.path, owner, ...noticesData }
    : { owner, ...noticesData };

  const result = await Notices.create(data);

  res.status(201).json(result);
};

const getNoticesByOwner = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  const result = await Notices.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.json(result);
};

const deleteNotice = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const noticeFound = await Notices.findOne({ owner, _id: id });
  if (!noticeFound) {
    throw HttpError(400, "This notice is not yours or already deleted");
  }

  const result = await Notices.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404, `Notice with ${id} not found`);
  }

  res.json({
    message: "Notice deleted",
  });
};

module.exports = {
  getAllNotices: ctrlWrapper(getAllNotices),
  addNotices: ctrlWrapper(addNotices),
  getNoticesByTitle: ctrlWrapper(getNoticesByTitle),
  getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
  getOneNotice: ctrlWrapper(getOneNotice),
  getNoticesByOwner: ctrlWrapper(getNoticesByOwner),
  deleteNotice: ctrlWrapper(deleteNotice),
};
