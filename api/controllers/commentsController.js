// const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

// create a comment
exports.createComment = CatchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const comment = await Comment.create({
    message: req.body.message,
    post: postId,
    user: req.id,
  });
  res.status(201).json(comment);
});

// update a comment
exports.updateComment = CatchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError("The comment does not exist", 404));
  }

  if (comment.user?._id?.toString() !== req.id) {
    return next(
      new AppError("You are not authorized to edit this comment", 401)
    );
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      message: req.body.message,
    },
    {
      new: true,
    }
  );
  res.status(200).json(updatedComment);
});

// delete a comment
exports.deleteComment = CatchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError("The comment does not exist", 404));
  }
  if (comment.user?._id?.toString() !== req.id) {
    return next(
      new AppError("You are not authorized to delete this comment", 401)
    );
  }
  await Comment.findByIdAndDelete(commentId);
  res.status(200).json("Deleted the comment successfully!");
});

// get a comment
exports.getComment = CatchAsync(async (req, res, next) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ post: postId });

  res.status(200).json(comments);
});
