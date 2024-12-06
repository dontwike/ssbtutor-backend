const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const PPDTS = mongoose.model("PPDTS", PostSchema);
module.exports = PPDTS;
