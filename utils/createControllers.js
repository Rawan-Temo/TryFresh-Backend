// utils/controllerFactory.js
const APIFeatures = require("./apiFeatures");
const { search } = require("./search");

const createController = (Model, modelName, searchFields, populate = "") => {
  const name = modelName.toLowerCase();

  // helper: build parsed query object for filtering & counting
  const buildParsedQuery = (reqQuery) => {
    const queryObj = { ...reqQuery };
    const excludedFields = ["page", "sort", "limit", "fields", "populate"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    return JSON.parse(queryStr);
  };

  // Get all documents
  const getAll = async (req, res) => {
    if (req.query.search) {
      await search(Model, [`${searchFields}`], populate, req, res);
      return;
    }
    try {
      const parsedQuery = buildParsedQuery(req.query);

      let query = Model.find();
      if (populate) {
        query = query.populate(populate);
      }

      const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const [docs, count] = await Promise.all([
        features.query.lean(),
        Model.countDocuments(parsedQuery),
      ]);

      res.status(200).json({
        status: "success",
        results: docs.length,
        total: count,
        data: docs,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Create new document
  const createOne = async (req, res) => {
    try {
      // If there's a file upload, handle the image path
      if (req.file) {
        req.body.image = `/${req.file.filename}`;
      }
      // note that this not dynamic for now, only works if the field is 'image'
      // To make it dynamic, you could pass the field name as an additional parameter to createController
      // and use that instead of hardcoding 'image' here.
      const newDoc = await Model.create(req.body);
      res.status(201).json({
        status: "success",
        data: newDoc,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Get one by ID
  const getOneById = async (req, res) => {
    try {
      let query = Model.findById(req.params.id);
      if (populate) {
        query = query.populate(populate);
      }
      const doc = await query.lean();

      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        data: doc,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Update one by ID
  const updateOne = async (req, res) => {
    try {
      let query = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (populate) {
        query = query.populate(populate);
      }
      const updatedDoc = await query;

      if (!updatedDoc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        data: updatedDoc,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // deleteOne one (soft delete)
  const deleteOne = async (req, res) => {
    try {
      let query = Model.findByIdAndDelete(req.params.id);
      const doc = await query;
      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        message: `${name} deactivated`,
        data: doc,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const deactivateOne = async (req, res) => {
    try {
      let query = Model.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );

      const doc = await query;

      if (!doc) {
        return res.status(404).json({ message: `${name} not found` });
      }
      res.status(200).json({
        status: "success",
        message: `${name} deactivated`,
        data: doc,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  return {
    getAll,
    createOne,
    getOneById,
    updateOne,
    deactivateOne,
    deleteOne,
  };
};

module.exports = createController;
