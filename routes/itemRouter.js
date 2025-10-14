const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerConfiguration");
const Item = require("../models/item");
const { deActivateMany } = require("../utils/deActivateMany");

router
  .route("/")
  .get( itemController.getAll)
  .post(authenticateToken, upload.single("image"), itemController.createOne);
router.route("/deActivate-many").patch(authenticateToken, async (req, res) => {
  await deActivateMany(Item, req, res);
}); // PATCH /api/sources/deActivate-many/:id
router
  .route("/:id")
  .get(itemController.getOneById)
  .patch(authenticateToken, itemController.updateOne)
  .delete(authenticateToken, itemController.deleteOne);

module.exports = router;
