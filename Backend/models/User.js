const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },

  role: {
    type: String,
    default: "user",
  },
  profileImage: String,

},
  { timestamps: true }
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;