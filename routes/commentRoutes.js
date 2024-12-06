const express = require("express");
const Comment = require("../model/mongodb/comment");
const router = express.Router();
const User = require("../model/mongodb/user");
const Authorization = require("../middleware/Authorization");

router.post("/comments", Authorization, async (req, res) => {
  try {
    console.log("comment");
    const { postId, parentComment, content } = req.body;
    const userId = req.userId;

    //MongoDB
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      res.status(404).send({
        message: "User not found!",
      });
    }
    const username = user.username;

    const comment = new Comment({ postId, parentComment, username, content });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to post comment",
      error: error.message,
    });
  }
});

// Get comments for a post
router.get("/comments/:postId", Authorization, async (req, res) => {
  try {
    console.log("child comments");
    const { postId } = req.params;
    const comments = await Comment.find({ postId });
    res.status(200).json({ comments, message: "comment found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch comments",
      err: error,
    });
  }
});

module.exports = { router };
