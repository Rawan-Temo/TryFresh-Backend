const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerConfiguration");

router
  .route("/")
  .get(authenticateToken, itemController.getAll)
  .post(authenticateToken, upload.single("image"), itemController.createOne);

router
  .route("/:id")
  .get(authenticateToken, itemController.getOneById)
  .patch(authenticateToken, itemController.updateOne)
  .delete(authenticateToken, itemController.deleteOne);

module.exports = router;
