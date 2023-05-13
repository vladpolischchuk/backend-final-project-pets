const { Schema, model } = require("mongoose");
const Joi = require("joi");


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const phoneRegexp = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

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
name: {
    type: String,
    default: "",
},
birthday: {
    type: String,
    default: "",
},
phone: {
    type: String,
    default: "00-00-00",
},
city: {
    type: String,
    default: "",
},
token: {
    type: String,
    default: "",
},
avatarURL: {
    type: String,
},
}, {versionKey: false, timestamps: true});

userSchema.post("save", (error, data, next) => {
  const {name, code} = error;
  error.status = (name === "MongoServerError" && code === 11000 ? 409 : 400)
  next();
});

const registerShema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

const userInfoShema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  name: Joi.string(),
  birthday: Joi.string(),
  avatarURL: Joi.string(),
  city: Joi.string().empty(false),
  phone: Joi.string()
});

const User = model("user", userSchema);

module.exports = {
  User,
  registerShema,
  userInfoShema,
};
