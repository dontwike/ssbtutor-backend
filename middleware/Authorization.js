const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      console.log("Access denied");
      return res.status(401).json({
        error: "Access Denied",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
