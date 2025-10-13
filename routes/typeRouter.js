const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerConfiguration");
const { deActivateMany } = require("../utils/deActivateMany");
const Type = require("../models/type");
router
  .route("/")
  .get(authenticateToken, typeController.getAll)
  .post(authenticateToken, upload.single("image"), typeController.createOne);

router.route("/deActivate-many").patch(authenticateToken, async (req, res) => {
  await deActivateMany(Type, req, res);
}); // PATCH /api/sources/deActivate-many/:id
router
  .route("/:id")
  .get(authenticateToken, typeController.getOneById)
  .patch(authenticateToken, typeController.updateOne)
  .delete(authenticateToken, typeController.deleteOne);
module.exports = router;
