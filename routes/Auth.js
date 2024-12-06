const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/mongodb/user");
const PurchasedItem = require("../model/mongodb/PurchasedItem");
const { getUserByUsername } = require("../Service/UserService/userSevrice");

// User-Registration
router.post("/signup", async (req, res) => {
  try {
    console.log("signup");
    const { username, password, name, phno } = req.body;

    const ifUsernamePresent = await User.findOne({ username });
    const ifPhoneNumberPresent = await User.findOne({ phno });

    if (ifUsernamePresent) {
      return res.status(400).json({
        success: false,
        message: "Username already exists. Please choose another one.",
      });
    }

    if (ifPhoneNumberPresent) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists. Please choose another one.",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      username,
      password: hashPass,
      name,
      phno,
      credits: 100,
      role: "user",
    });

    const items = ["PPDT", "WAT", "TAT", "SRT"];
    const itemsArray = [];

    items.forEach((itemType) => {
      let maxLimit;
      if (itemType === "PPDT") maxLimit = 10;
      if (itemType === "WAT") maxLimit = 2;
      if (itemType === "TAT") maxLimit = 5;
      if (itemType === "SRT") maxLimit = 2;

      for (let i = 1; i <= maxLimit; i++) {
        itemsArray.push(`${itemType} ${i}`);
      }
    });

    try {
      const createFreeItems = await PurchasedItem.create({
        userId: createUser._id,
        itemId: itemsArray,
      });
    } catch (err) {
      console.error("Error creating items:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create purchased items",
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: createUser.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// User-Login
router.post("/login", async (req, res) => {
  try {
    console.log("login");
    const { username, password } = req.body;

    const ifUserPresent = await getUserByUsername(username);

    if (!ifUserPresent) {
      return res.status(400).json({
        success: false,
        message: "Username does not exist. Please sign up!",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      ifUserPresent.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password didn't match. Authentication failed!",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: ifUserPresent._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Login failed. An error occurred.",
    });
  }
});

module.exports = { router };
