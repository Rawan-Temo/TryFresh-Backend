const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
} = require("../middlewares/authMiddleware");


router.route("/").get(authenticateToken,  userController.getAll).post( authenticateToken,userController.createUser);


router.post("/login", userController.login);

router.route("/:id").get(authenticateToken,  userController.getOneById).delete(authenticateToken, userController.deleteOne);

module.exports = router;
