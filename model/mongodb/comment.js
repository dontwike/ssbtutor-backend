const mongoose = require("mongoose");

const commentSectionSchema = new mongoose.Schema({
  postId: {
    type: Number,
    ref: "Post",
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  username: {
    type: String,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSectionSchema);

module.exports = Comment;
