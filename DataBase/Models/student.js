const { default: mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  matno: String,
  status: {
    type: String,
    enum: ["returned", "not returned"],
    default: "not returned",
  },
  expID: mongoose.Types.ObjectId,
});

module.exports.studentModel = mongoose.model("student", studentSchema);
