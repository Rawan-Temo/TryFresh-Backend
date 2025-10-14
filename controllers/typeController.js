const Item = require("../models/item");
const Type = require("../models/type");
const createController = require("../utils/createControllers");
const { search } = require("../utils/search");
const APIFeatures = require("../utils/apiFeatures");

const typeController = createController(Type, "type", "name");
const getAllWithCount = async (req, res) => {
  try {
    if (req.query.search) {
      await search(Type, ["name"], "", req, res);
      return;
    }

    // Build parsed query for filtering & counting
    const parsedQuery = (() => {
      const queryObj = { ...req.query };
      ["page", "sort", "limit", "fields", "populate"].forEach(
        (el) => delete queryObj[el]
      );
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      return JSON.parse(queryStr);
    })();

    let query = Type.find();

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query.lean();

    // Count related items for each doc (e.g., Type -> Items)
    const docsWithCount = await Promise.all(
      docs.map(async (doc) => {
        const itemsCount = await Item.countDocuments({ typeId: doc._id });
        return { ...doc, itemsCount };
      })
    );

    const total = await Type.countDocuments(parsedQuery);

    res.status(200).json({
      status: "success",
      results: docsWithCount.length,
      total,
      data: docsWithCount,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
module.exports = { ...typeController, getAllWithCount };
