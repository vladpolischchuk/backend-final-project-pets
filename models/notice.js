const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const birthdayRegexp = /^\d{2}\.\d{2}\.\d{4}$/;
const locationRegexp = /^[A-Za-z ]+$/;

const noticesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 16,
    required: true,
  },
  birthday: {
    type: String,
    default: "12.05.2023",
    required: true,
  },
  breed: {
    type: String,
    minLength: 2,
    maxLength: 16,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Choose the sex of animal"],
  },
  category: {
    type: String,
    enum: ["sell", "lost-found", "for-free"],
    required: true,
  },
  price: {
    type: String,
  },
  comments: {
    type: String,
  },
  // image: {
  //   type: String,
  //   required: true,
  // },
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: "user",
  //   required: true,
  // },
  // email: {
  //   type: String,
  //   required: true,
  // },
  // phone: {
  //   type: String,
  //   required: true,
  // },
});

noticesSchema.post("save", handleMongooseError);

const addNoticeSchema = Joi.object(
  {
    category: Joi.string().valid("sell", "lost-found", "for-free").required(),
    title: Joi.string().min(2).max(16).required(),
    birthday: Joi.string().pattern(birthdayRegexp),
    name: Joi.string().min(2).max(16).required(),
    breed: Joi.string().min(2).max(16).required(),
    sex: Joi.string().valid("male", "female").required(),
    location: Joi.string()
      .pattern(locationRegexp)
      .when("category", {
        is: Joi.valid("sell", "lost-found", "for-free"),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
    price: Joi.number()
      .min(0)
      .when("category", {
        is: "sell",
        then: Joi.number().min(1).required(),
        otherwise: Joi.optional(),
      }),
    comments: Joi.string(),
  },
  { versionKey: false, timestamps: true }
);

const getCategorySchema = Joi.object({
  category: Joi.string().valid("sell", "lost-found", "for-free"),
});

const schemas = {
  addNoticeSchema,
  getCategorySchema,
};

const Notices = model("notices", noticesSchema);

module.exports = {
  Notices,
  schemas,
};