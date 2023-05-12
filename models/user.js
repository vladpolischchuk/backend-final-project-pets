const { Schema, model, version } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../utils/index");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegexp = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

const userSchema = new Schema({
      password: {
            type: String,
            minlength: 6,
            maxlength: 16,
            required: [true, 'Password is required'],
      },
      email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailRegexp,
            unique: true,
      },
      name: {
            type: String,
      },
      birthday: {
            type: Date,
            default: "12.05.2023",
            required: true,
      },
      phone: {
            type: Number,
            match: phoneRegexp,
            unique: true,
      },
      city: {
            type: String,
            default: "Kiev",
      },
      token: {
            type: String,
            default: null,
      },
      avatarURL: {
            type: String,
            required: true,
      },
      verify: {
            type: Boolean,
            default: false,
      },
      verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
      },
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
      email: Joi.string().pattern(emailRegexp).required(),
      password: Joi.string().min(6).max(16).required(),
});

const loginSchema = Joi.object({
      email: Joi.string().pattern(emailRegexp).required(),
      password: Joi.string().min(6).max(16).required(),
});

const updateSubscription = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business"),
});

const emailSchema = Joi.object({
      email: Joi.string().pattern(emailRegexp).required(),
});

const schemas = {
      registerSchema,
      loginSchema,
      updateSubscription,
      emailSchema,
};

const User = model("user", userSchema);

module.exports = {
      User,
      schemas,
};