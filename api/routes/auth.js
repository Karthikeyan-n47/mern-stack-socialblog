const router = require("express").Router();
const authController = require("../controllers/authController");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;

// -----------------------------------------------------------------------------------

/*

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    const newPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: newPassword,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      res.status(404).json("Invalid email or password! Please try again!");
    }
    if (userDoc?.password) {
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        userDoc.password
      );
      if (!isPasswordCorrect) {
        res.status(404).json("Invalid email or password! Please try again!");
      }
      const { password, ...others } = userDoc._doc;
      res.status(200).json(others);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;


*/
