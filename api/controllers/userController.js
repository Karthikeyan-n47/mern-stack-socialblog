const User = require("../models/User");
const Post = require("../models/Post");
const Contact = require("../models/Contact");
const bcrypt = require("bcrypt");
const { s3Uploadv2 } = require("../s3Service");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

exports.getUser = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const { password, ...others } = user._doc;
  res.status(200).json(others);
});

exports.updateUser = CatchAsync(async (req, res, next) => {
  const userId = req.id;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found!", 404));
  }
  let profilePic = user?.profilePic || "";
  if (req.file) {
    const awsUpload = await s3Uploadv2(req.file);
    // console.log(awsUpload);
    profilePic = awsUpload.Location;
  }
  req.body.profilePic = profilePic;
  // console.log(userId);
  // console.log(req.params);
  if (userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } else {
    return next(new AppError("You can only update your account", 401));
  }
});

exports.deleteUser = CatchAsync(async (req, res, next) => {
  const userId = req.id;
  if (userId === req.params.id) {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    await Post.deleteMany({ username: user.username });
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("toker").status(200).json("Account has been deleted...");
  } else {
    return next(new AppError("You can only delete your account", 401));
  }
});

exports.contactUs = CatchAsync(async (req, res, next) => {
  const { email, name, message } = req.body;
  const contact = await Contact.create({
    email,
    name,
    message,
  });
  res.status(200).json({
    status: "Contact form submitted successfully!",
    data: contact,
  });
});
