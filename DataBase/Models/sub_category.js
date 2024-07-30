const { default: mongoose } = require("mongoose")

const sub_categorySchema = new mongoose.Schema({
  name: String,
  category: mongoose.Types.ObjectId
});

module.exports.sub_categoryModel = mongoose.model("sub_category", sub_categorySchema);