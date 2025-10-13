const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,

  }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
