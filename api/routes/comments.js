const router = require("express").Router();
const authController = require("../controllers/authController");
const commentsController = require("../controllers/commentsController");

// create a comment
router.post(
  "/:postId",
  authController.protect,
  commentsController.createComment
);
// update a comment
router.put(
  "/:commentId",
  authController.protect,
  commentsController.updateComment
);
// delete a comment
router.delete(
  "/:commentId",
  authController.protect,
  commentsController.deleteComment
);
// get comments
router.get("/:postId", authController.protect, commentsController.getComment);

module.exports = router;
