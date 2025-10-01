const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerConfiguration");
router
  .route("/")
  .get(authenticateToken, typeController.getAll)
  .post(authenticateToken, upload.single("image"), typeController.createOne);

router
  .route("/:id")
  .get(authenticateToken, typeController.getOneById)
  .patch(authenticateToken, typeController.updateOne)
  .delete(authenticateToken, typeController.deleteOne);

module.exports = router;
