const router = require("express").Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

// create a post
router.post(
  "/",
  authController.protect,
  authController.uploadPhoto,
  postController.createPost
);

// edit a post
router.put("/:id", authController.protect, postController.editPost);
// delete a post
router.delete("/:id", authController.protect, postController.deletePost);
// get a post
router.get("/:id", postController.getPost);
// get all posts
router.get("/", postController.getAllPosts);

module.exports = router;

// --------------------------------------------------------------------------------
/*

const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { s3Uploadv2 } = require("../s3Service");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// create a post
router.post("/", upload.single("file"), async (req, res) => {
  let photo = "";
  const { title, desc, username } = req.body;
  if (req.file) {
    const awsUpload = await s3Uploadv2(req.file);
    // console.log(awsUpload);
    photo = awsUpload.Location;
  }
  try {
    const newPost = await Post.create({
      username,
      title,
      desc,
      photo,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// edit a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    try {
      if (req.body.username === post.username) {
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
        res.status(401).json("You can only update posts created by you!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post.username, req.body);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).json("Post has been deleted successfully!");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only delete posts created by you!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all posts
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;


*/
