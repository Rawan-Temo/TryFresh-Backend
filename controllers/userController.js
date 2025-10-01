const User = require("../models/user");
const createController = require("../utils/createControllers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = createController(User, "user", "username");
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the created user (excluding the password)
    const userResponse = {
      username: newUser.username,
    };

    res.status(201).json({ status: "success", data: userResponse });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    // exclude password from the user object

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    // Compare the entered password with the stored password (hashed)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      }
    );
    if (user) {
      user.password = undefined;
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { ...userController, login, createUser };
