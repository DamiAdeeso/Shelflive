const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  password: String,
  email: String,
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
});

module.exports.userModel = mongoose.model("user", userSchema);
