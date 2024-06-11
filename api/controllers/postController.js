const User = require("../models/User");
const Post = require("../models/Post");
const { s3Uploadv2 } = require("../s3Service");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

exports.createPost = CatchAsync(async (req, res, next) => {
  let photo = "";
  const { title, desc, categories } = req.body;
  const cat = JSON.parse(categories);
  // console.log(cat);
  if (req.file) {
    const awsUpload = await s3Uploadv2(req.file);
    // console.log(awsUpload);
    photo = awsUpload.Location;
  }
  const newPost = await Post.create({
    user: req.id,
    title,
    desc,
    photo,
    categories: cat,
  });

  res.status(201).json(newPost);
});

exports.editPost = CatchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (!post) {
    return next(new AppError("Post not found!", 404));
  }
  if (req.id === post.user?._id?.toString()) {
    req.body.categories = JSON.parse(req.body.categories);
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedPost);
  } else {
    return next(new AppError("You can only update posts created by you!", 401));
  }
});

exports.deletePost = CatchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.id);
  if (!user) {
    return next(new AppError("user account not found!", 404));
  }
  if (!post) {
    return next(new AppError("Post not found!", 404));
  }
  // console.log(post.username, req.body);
  if (post.user?._id?.toString() === user?._id?.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json("Post has been deleted successfully!");
  } else {
    return next(new AppError("You can only delete posts created by you!", 401));
  }
});

exports.getPost = CatchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

exports.getAllPosts = CatchAsync(async (req, res, next) => {
  const userId = req.query.user;
  const catName = req.query.cat;
  const search = req.query.search;

  let posts;
  if (userId) {
    posts = await Post.find({ user: userId });
  } else if (catName) {
    posts = await Post.find({
      categories: {
        $in: [catName],
      },
    });
  } else if (search) {
    posts = await Post.aggregate([
      {
        $match: {
          title: {
            $regex: search,
            $options: "i",
          },
        },
      },
    ]);
  } else {
    posts = await Post.find();
  }
  res.status(200).json(posts);
});
