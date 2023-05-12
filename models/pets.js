const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../utils/index");

const petsSchema = new Schema({
      name: {
            type: String,
            required: [true, 'Set name for contact'],
      },
      email: {
            type: String,
            required: [true, 'Set email for contact']
      },
      phone: {
            type: String,
            required: [true, 'Set phone for contact']
      },
      favorite: {
            type: Boolean,
            default: false,
      },
      owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
      },
}, { versionKey: false, timestamps: true });

petsSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).required(),
      favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
      favorite: Joi.boolean().required(),
});

const Pets = model("contacts", petsSchema);

module.exports = {
      Pets,
      addSchema,
      updateFavoriteSchema,
};