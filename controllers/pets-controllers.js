const { Pet } = require("../models/pets");

const {
      HttpError,
      ctrlWrapper,
} = require("../utils/index");

const addPet = async (req, res, next) => {
      const owner = req.user.id;
      const petData = req.body;
      const data = !!req.file
            ? { photo: req.file.path, owner, ...petData }
            : { owner, ...petData };
      
      const newPet = Pet.create(data)

      res.status(201).json(newPet);
};

const removePet = async (req, res, next) => {
      const { id } = req.params;
      const { _id } = req.user;
      const deleteItem = await Pet.findByIdAndRemove({
            _id: id,
            owner: {_id},
      });

      if (!deleteItem) {
            throw HttpError(404, 'This pet is not in the list!');
      };

      res.status(200).json({ data: deleteItem });
};

const getAllPets = async (req, res, next) => {
      const { _id: owner } = req.user;
      const allPets = await Pet.find({ owner });

      if (!allPets) {
            throw HttpError(404, 'Probably this user doesnt have any pet registered yet!');
      }

      res.status(200).json({
            data: allPets,
      });
};

module.exports = {
      getAllPets: ctrlWrapper(getAllPets),
      addPet: ctrlWrapper(addPet),
      removePet: ctrlWrapper(removePet),
};