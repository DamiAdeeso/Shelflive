const { result } = require("./ResultObj");
const { categoryModel } = require("../Models/category");
const { sub_categoryModel } = require("../Models/sub_category");
const { default: mongoose } = require("mongoose");

module.exports.addCategory = async (data, user) => {
  const { category_name, sub_name, category } = data;
  try {
    // create new category
    const newCategory = new categoryModel({
      name: category_name,
    });

    // create new sub category
    const newSubCategory = new sub_categoryModel({
      category: category && mongoose.Types.ObjectId(category),
      name: sub_name,
    });

    // if sub category and the category were selected then add new sub category
    if (sub_name && category) await newSubCategory.save();

    // if new category was added and the user role is admin then add new category
    if (category_name && user.role === "admin") await newCategory.save();

    // create a message ddepending on what was added to the DB
    const message =
      sub_name && category_name && user.role === "admin"
        ? `your category and sub category was added successfully !`
        : sub_name && !category_name
        ? `your sub category was added successfully !`
        : `your category was added successfully !`;

    const categories = JSON.parse(await this.getCategories());

    // return the final result
    return result(false, message, categories.result);
  } catch (error) {
    // return an error if server DB stops working
    return result(true, "categoryFun line 6 => " + error.message, null);
  }
};

module.exports.getCategories = async () => {
  try {
    const categories = await categoryModel.aggregate([
      {
        $lookup: {
          from: "sub_categories",
          localField: "_id",
          foreignField: "category",
          as: "sub_category",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          sub_category: "$sub_category",
        },
      },
    ]);
    return result(false, "", categories);
  } catch (error) {
    return result(true, "categoryFun line 44 => " + error.message, null);
  }
};
