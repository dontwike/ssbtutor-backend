const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phno: { type: String, required: true },
  credits: { type: Number },
  role: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
