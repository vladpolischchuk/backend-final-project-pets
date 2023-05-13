const { Schema, model } = require("mongoose");
const joi = require('joi');
const {handleMongooseError} = require("../utils")

const petSchema = new Schema({
    name: {
        type: String,
        required: [true, "name field shouldn't be empty"],
    },
    breed: {
        type: String,
        required: [true, "fill in the breed of a pet"],
    },
    birthDate: {
        type: String,
        required: [true, "fill in the birth date of a pet"],
    },
    photo: {
        type: String,
        required: [true, "add pet's photo, please"],
    },
    comments: {
        type: String,
        required: [true, "add a comment about this pet, please"],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { versionKey: false, timestamps: true })

const Pet = model("pet", petSchema);

petSchema.post("save", handleMongooseError);

const petJoiSchema = joi.object({
  name: joi.string().min(2).required().messages({
    "any.required": `"name" is required`,
    "string.empty":`"name" field can't be empty!`
  }),
  breed: joi.string().min(3).required().messages({
    "any.required": `"breed" is required`,
    "string.empty":`"breed" field can't be empty!`
  }),
  birthDate: joi.string().required().messages({
    "any.required": `"birthDate" is required`,
    "string.empty":`"birthDate" field can't be empty!`
  }),
  photo: joi.string().required().messages({
    "any.required": `"photo" is required`,
    "string.empty":`"photo" field can't be empty!`
  }),
  comments: joi.string().required().messages({
    "any.required": `"comments" is required`,
    "string.empty":`"comments" field can't be empty!`
  }),
  owner: joi.string().required().messages({
    "any.required": `"owner" is required`,
    "string.empty":`"owner" field can't be empty!`
  }),
})

module.exports = {
    Pet,
    petJoiSchema
}
