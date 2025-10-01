const Type = require("../models/type");
const createController = require("../utils/createControllers");

module.exports = createController(Type, "type", "name");
