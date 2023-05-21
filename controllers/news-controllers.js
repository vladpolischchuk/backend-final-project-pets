const { News } = require("../models/news");
const { HttpError } = require("../utils/HttpError");

const getNews = async (req, res, next) => {
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  const news = await News.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.json(news);
};

const getNewsByTitle = async (req, res) => {
  const { page, limit, title } = req.query;
  const skip = (page - 1) * limit;

  /* if (!title) {
    throw HttpError(404, "Title not selected");
  } */

  const optimizerTitle = new RegExp(title, "i");

  const resultAll = await News.find(title ? { title: optimizerTitle } : {});

  const result = await News.find(
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

  res.json({ result, total: resultAll.length });
};

module.exports = {
  getNews,
  getNewsByTitle,
};
