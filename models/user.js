const { Schema, model, version } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../utils/index");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
      password: {
            type: String,
            minlength: 6,
            required: [true, 'Password is required'],
      },
      email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailRegexp,
            unique: true,
      },
      subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
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
      password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
      email: Joi.string().pattern(emailRegexp).required(),
      password: Joi.string().min(6).required(),
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