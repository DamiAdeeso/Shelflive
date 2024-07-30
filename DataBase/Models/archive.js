const { default: mongoose } = require("mongoose");

const archiveSchema = new mongoose.Schema({
  name: String,
  category: mongoose.Types.ObjectId,
  sub_category: mongoose.Types.ObjectId,
  cost: Number,
  quantity: Number,
  current_worth: Number,
  condition: {
    type: String,
    enum: ["Available", "Damaged", "Not Available"],
  },
});
module.exports.archiveModel = mongoose.model("archive", archiveSchema);
