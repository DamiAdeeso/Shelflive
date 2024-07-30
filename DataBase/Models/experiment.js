const { default: mongoose } = require("mongoose");

const experimentSchema = new mongoose.Schema({
  title: String,
  handler: String,
  level: Number,
  items: [mongoose.Types.ObjectId],
  date: Number
});

module.exports.experimentModel = mongoose.model("experiment", experimentSchema);
