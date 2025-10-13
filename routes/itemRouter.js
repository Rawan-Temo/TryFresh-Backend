const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerConfiguration");
const Item = require("../models/item");

router
  .route("/")
  .get(authenticateToken, itemController.getAll)
  .post(authenticateToken, upload.single("image"), itemController.createOne);
router.route("/deActivate-many").patch(authenticateToken, async (req, res) => {
  await deActivateMany(Item, req, res);
}); // PATCH /api/sources/deActivate-many/:id
router
  .route("/:id")
  .get(authenticateToken, itemController.getOneById)
  .patch(authenticateToken, itemController.updateOne)
  .delete(authenticateToken, itemController.deleteOne);

module.exports = router;
