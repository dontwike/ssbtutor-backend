const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/Authorization");
const { getUserById } = require("../Service/UserService/userSevrice");
const User = require("../model/mongodb/user");

router.get('/hello', function (req, res) {
  res.send("Welcome to OGC server!");
})

router.get("/getCredits", Authorization, async (req, res) => {
  try {
    console.log("credits");
    const userId = req.userId;

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found!",
      credits: user.credits,
      user: user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Something went wrong!!!",
    });
  }
});

router.post("/purchase-credits", Authorization, async (req, res) => {
  try {
    console.log("purchase credit");
    const userId = req.userId;
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    const updatedUser = await User.updateOne(
      {
        _id: user._id,
      },
      { credits: user.credits + 300 }
    );

    const upuser = await getUserById(userId);

    if (!updatedUser) {
      res.status(404).send({
        success: false,
        message: "User not updated!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated",
      upuser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong!!!",
    });
  }
});

module.exports = { router };
