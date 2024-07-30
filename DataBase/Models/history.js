const { default: mongoose } = require("mongoose");

const historySchema = new mongoose.Schema({
  userID: mongoose.Types.ObjectId,
  itemID: mongoose.Types.ObjectId,
  date: Number,
  action: String,
  itemBeforeChange: Object,
  itemAfterChange: Object,
  operation: {
    type: String,
    enum: ["modification", "add", "archive"],
  },
});

module.exports.historyModel = mongoose.model("history", historySchema);
