const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Get User
router.get("/:id", userController.getUser);

// Update User
router.put(
  "/:id",
  authController.protect,
  authController.uploadPhoto,
  userController.updateUser
);

// Delete User
router.delete("/:id", authController.protect, userController.deleteUser);

// Contact us
router.post("/contact-us", userController.contactUs);

module.exports = router;

// -----------------------------------------------------------------------------------------------
/*

const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { s3Uploadv2 } = require("../s3Service");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// Get User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update User
router.put("/:id", upload.single("file"), async (req, res) => {
  const user = await User.findById(req.params.id);
  let profilePic = user?.profilePic || "";
  if (req.file) {
    const awsUpload = await s3Uploadv2(req.file);
    // console.log(awsUpload);
    profilePic = awsUpload.Location;
  }
  req.body.profilePic = profilePic;
  // console.log(req.body.userId === req.params.id);
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account");
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(401).json("You can only delete your account");
  }
});

module.exports = router;


*/
