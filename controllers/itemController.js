const Type = require("../models/type");
const Item = require("../models/item");
const createController = require("../utils/createControllers");

module.exports = createController(Item, "item", "name", "typeId");
