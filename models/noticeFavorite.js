const { Schema, model } = require("mongoose");

const noticeFavoritesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  notice: {
    type: Schema.Types.ObjectId,
    ref: "notices",
    require: true,
  },
});

const NoticesFavorite = model("noticesFavorite", noticeFavoritesSchema);

module.exports = NoticesFavorite;
