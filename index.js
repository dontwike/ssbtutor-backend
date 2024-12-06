const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const AuthRouter = require("./routes/Auth");
const CloudinaryRouter = require("./routes/Cloudinary");
const PPDTRouter = require("./routes/ppdtRoutes");
const profileRoutes = require("./routes/profileRoutes");
const commentRoutes = require("./routes/commentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const connectToDatabase = require("./model/mongodb/dbconfig");

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", AuthRouter.router);
app.use("/", CloudinaryRouter.router);
app.use("/", PPDTRouter.router);
app.use("/", profileRoutes.router);
app.use("/", commentRoutes.router);
app.use("/", paymentRoutes.app);

app.listen(process.env.PORT, () => {
  connectToDatabase();
  console.log("listening to port " + process.env.PORT);
});

// connectToDatabase();
module.exports = app;
