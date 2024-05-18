const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const categoryRouter = require("./routes/categories");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const commentRouter = require("./routes/comments");
// const multer = require("multer");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/category", categoryRouter);
app.use("/api/comments", commentRouter);

app.use("*", (req, res, next) => {
  next(
    new AppError(
      `Could not find the url: ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

app.listen(8800, () => {
  console.log("Server is running successfully!");
});
