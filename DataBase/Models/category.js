const { default: mongoose } = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: String,
});

module.exports.categoryModel = mongoose.model("category", categorySchema);