const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
// const Email = require("../utils/Email");
const nodemailer = require("nodemailer");

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

exports.uploadPhoto = upload.single("file");

const sendEmail = async (user, url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.GMAIL_HOST,
      pass: process.env.GMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `Karthik <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: "Password reset link. Only valid for next 30 mins.",
    text: `Hello ${user.name}, the link to reset your password is: ${url}  It is only valid for the next 30 minutes.`,
  };
  await transport.sendMail(mailOptions);
};

exports.protect = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(req.cookies);
  if (!token) return next(new AppError("You are not logged in!", 401));
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return next(
        new AppError("Your session has expired! Please log in again!", 403)
      );
    }
    // console.log(payload);
    req.id = payload.id;
    next();
  });
};

exports.register = CatchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    username,
    email,
    password: newPassword,
  });
  res.status(201).json(newUser);
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    return next(
      new AppError("Invalid email or password! Please try again!", 404)
    );
  }
  if (userDoc?.password) {
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userDoc.password
    );
    if (!isPasswordCorrect) {
      return next(
        new AppError("Invalid email or password! Please try again!", 404)
      );
    }
    const age = 1000 * 60 * 60 * 24 * 7;
    const { password, ...others } = userDoc._doc;
    const token = jwt.sign(
      {
        id: userDoc._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );
    // console.log(token);
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(others);
  }
});

exports.logout = CatchAsync(async (req, res, next) => {
  res
    .clearCookie("token")
    .status(200)
    .json("You have been logged out successfully!");
});

exports.forgotPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Account not found!", 401));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Account not found!", 404));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30m",
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;
  console.log(token, resetUrl);
  await sendEmail(user, resetUrl);
  // await new Email(user, resetUrl).sendPasswordReset();
  res.status(200).json({
    status: "Password reset link has been sent to the registered email",
    data: resetUrl,
  });
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  const token = req.params.token;
  const id = req.params.id;
  const { password, confirmPassword } = req.body;
  // console.log(token, id);
  if (password !== confirmPassword) {
    return next(new AppError("Entered passwords must be same", 401));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("The password reset link has expired!", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return next(new AppError("Password reset link has expired!", 401));
    // console.log("verification successfull!");
    if (id !== payload.id)
      return next(new AppError("Password reset link has expired!", 401));
  });

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findByIdAndUpdate(id, {
    password: newPassword,
  });
  // console.log("user updated successfully!");
  // user.password = newPassword;
  // await user.save();
  res.status(200).json("Password has been reset successfully!");
});
