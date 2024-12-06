const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const ppdt = require("../model/mongodb/ppdt");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ssb-ogc",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

router.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    // Fetch existing data from MongoDB
    const existingData = await ppdt.find();
    const currentLength = existingData.length; // Current length of the database

    // Map over the uploaded files to create new entries
    const newPosts = req.files.map((file, index) => ({
      id: currentLength + index + 1, // Incremental ID
      name: `PPDT ${currentLength + index + 1}`, // Name based on new length
      link: file.path, // Path of the uploaded file
    }));

    // Insert all the new posts into MongoDB
    await ppdt.insertMany(newPosts);

    res.send("Upload completed successfully!!!");
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});


router.post("/watupload", function (req, res) {
  try {
  } catch (error) {}
});

module.exports = {
  storage,
  router,
};
