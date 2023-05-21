const { ctrlWrapper } = require("../utils");

const { Notices } = require("../models/notice");

const { HttpError } = require("../utils");

const NoticesFavorite = require("../models/noticeFavorite");

const addNoticesFavorite = async (req, res) => {
  const noticeId = req.params.noticeId;
  const userId = req.user._id;

  const notice = await Notices.findOne({
    _id: noticeId,
  });
  if (!notice) {
    throw new HttpError("404", "Notice not found");
  }

  const favoriteNoticeAdded = await NoticesFavorite.findOne({
    user: userId,
    notice: noticeId,
  });
  if (favoriteNoticeAdded) {
    throw new HttpError("409", "Notice already added to favorites");
  }

  const result = await NoticesFavorite.create({
    user: userId,
    notice: noticeId,
  });
  return res.status(201).json({
    status: "success",
    code: 201,
    data: {
      result,
    },
  });
};

const deleteNoticesFavorite = async (req, res) => {
  const noticeId = req.params.noticeId;
  const userId = req.user._id;

  const result = await NoticesFavorite.findOneAndRemove({
    user: userId,
    notice: noticeId,
  });
  return res.status(200).json({
    status: "succeed",
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = {
  addNoticesFavorite: ctrlWrapper(addNoticesFavorite),
  deleteNoticesFavorite: ctrlWrapper(deleteNoticesFavorite),
};
