const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post must have a title"],
      unique: true,
    },
    desc: {
      type: String,
      required: [true, "Post must have a description"],
    },
    photo: {
      type: String,
      required: [true, "Post must have a photo"],
    },
    categories: {
      type: Array,
      default: null,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -password",
  });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
