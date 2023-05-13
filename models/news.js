const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const newsSchema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    url: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

newsSchema.post("save", handleMongooseError);

const News = model("news", newsSchema);

module.exports = News;
