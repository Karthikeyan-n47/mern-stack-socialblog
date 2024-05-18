const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Comment must have a message"],
    },
    post: {
      type: String,
      required: [true, "comment must belong to a post"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username profilePic",
  });
  next();
});

CommentSchema.post("save", async function (doc, next) {
  await doc.populate("user", "_id username profilePic");
  next();
});
module.exports = mongoose.model("Comment", CommentSchema);
