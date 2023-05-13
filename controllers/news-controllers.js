const { News } = require("../models/news");

const getNews = async (req, res, next) => {
  const news = await News.find();

  res.json(news);
};

const getNewsByTitle = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw HttpError(404, "Title not selected");
  }

  const optimizerTitle = new RegExp(title, "i");
  const result = await News.find({ title: optimizerTitle });

  if (result.length === 0) {
    throw HttpError(404, "Title not found");
  }

  res.json(result);
};

module.exports = {
  getNews,
  getNewsByTitle,
};
