const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const friendsSchema = new Schema(
  {
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    addressUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
    },
    workDays: {
      type: Array,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

friendsSchema.post("save", handleMongooseError);

const Friends = model("friends", friendsSchema);

module.exports = Friends;
