const User = require("../../model/mongodb/user");

async function getUserById(userId) {
  const ifUserPresent = await User.findOne({
    _id: userId,
  });

  if (!ifUserPresent) {
    return false;
  }

  return ifUserPresent;
}

async function getUserByUsername(username) {
  const ifUserPresent = await User.findOne({
    username: username,
  });

  if (!ifUserPresent) {
    return false;
  }

  return ifUserPresent;
}

module.exports = {
  getUserById,
  getUserByUsername
}