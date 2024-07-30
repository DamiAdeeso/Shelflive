const { default: mongoose } = require("mongoose");
const { archiveModel } = require("../Models/archive");
const { inventoryModel } = require("../Models/inventory");
const { result } = require("./ResultObj");

module.exports.addItem = async (data) => {
  try {
    // create new item and save it in the data base
    const item = new inventoryModel({
      ...data,
      sub_category: data.sub_category ? data.sub_category : null,
    });
    const newItem = await item.save();

    return result(
      false,
      `the item ${data.name} was added successfuly !`,
      newItem
    );
  } catch (error) {
    // return error if server DB crashed
    return result(
      true,
      `${__dirname} addItem function => ${error.message}`,
      null
    );
  }
};

module.exports.getItems = async () => {
  try {
    const items = await inventoryModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      {
        $unwind: {
          path: "$sub_category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "histories",
          let: { itemID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$itemID", "$$itemID"] },
              },
            },
            {
              $group: {
                _id: "$operation",
                date: { $max: "$date" },
              },
            },
          ],
          as: "last_modification",
        },
      },
      {
        $addFields: {
          last: {
            $filter: {
              input: "$last_modification",
              as: "modif",
              cond: { $eq: ["$$modif._id", "modification"] },
            },
          },
          add: {
            $filter: {
              input: "$last_modification",
              as: "modif",
              cond: { $eq: ["$$modif._id", "add"] },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$last",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$add",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          sub_category: "$sub_category",
          category: "$category",
          cost: 1,
          quantity: 1,
          current_worth: 1,
          condition: 1,
          last_modification: "$last.date",
          created: "$add.date",
        },
      },
    ]);
    return result(false, "all items", items);
  } catch (error) {
    console.log(error.message);
    return result(
      true,
      `${__dirname} getItems function => ${error.message}`,
      null
    );
  }
};

module.exports.getItem = async (itemID, forEdit) => {
  try {
    const item = forEdit
      ? await inventoryModel.findById(itemID)
      : await inventoryModel.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(itemID),
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: {
              path: "$category",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "sub_categories",
              localField: "sub_category",
              foreignField: "_id",
              as: "sub_category",
            },
          },
          {
            $unwind: {
              path: "$sub_category",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "histories",
              let: { itemID: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$itemID"] },
                        { $eq: ["$operation", "modification"] },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    date: 1,
                    _id: false,
                  },
                },
              ],
              as: "last_modification",
            },
          },
          {
            $project: {
              name: 1,
              sub_category: "$sub_category",
              category: "$category",
              cost: 1,
              quantity: 1,
              current_worth: 1,
              condition: 1,
              last_modification: { $max: "$last_modification.date" },
            },
          },
        ]);

    const message = !forEdit
      ? `the item has been modified successfully`
      : "get item";
    return result(false, message, forEdit ? item : item[0]);
  } catch (error) {
    return result(
      true,
      `${__dirname} getItem function => ${error.message}`,
      null
    );
  }
};

module.exports.deleteItem = async (itemID, role) => {
  // check if the user is admin
  if (role !== "admin") return result(true, "not allowed", undefined);

  try {
    // delete item and get all it's informations
    let item = await inventoryModel.findOneAndDelete({ _id: itemID });
    item = JSON.stringify(item);

    // save the deleted item to archive document
    const archive = new archiveModel(JSON.parse(item));
    await archive.save();

    // return the result
    return result(false, "item deleted successfully !", JSON.parse(item));
  } catch (error) {
    return result(
      true,
      `${__dirname} deleteItem function => ${error.message}`,
      null
    );
  }
};

module.exports.editItem = async (itemID, data) => {
  try {
    // check if there is any true changes before
    let itemToEdit = JSON.stringify(await inventoryModel.findById(itemID));
    itemToEdit = JSON.parse(itemToEdit);
    if (
      itemToEdit.category === data.category &&
      itemToEdit.condition === data.condition &&
      itemToEdit.cost === data.cost &&
      itemToEdit.current_worth === data.current_worth &&
      itemToEdit.name === data.name &&
      itemToEdit.quantity === data.quantity &&
      itemToEdit.sub_category === data.sub_category
    )
      return result(
        true,
        `please make some changes before to confirme !`,
        null
      );

    // edit the selected item
    const item = await inventoryModel.findOneAndUpdate(
      { _id: itemID },
      {
        $set: {
          category: data.category,
          condition: data.condition,
          cost: data.cost,
          current_worth: data.current_worth,
          name: data.name,
          quantity: data.quantity,
          sub_category: data.sub_category,
        },
      }
    );

    return result(false, "item edited", item);
  } catch (error) {
    return result(true, `inventory line 120 => ${error.message}`, null);
  }
};

module.exports.getArchives = async (role) => {
  // check if the user is admin
  if (role !== "admin") return result(true, `not allowed !`, null);

  try {
    // geting archive information with 3 documents "categories document", "sub_categories document" and "histories document"
    const archives = await archiveModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      {
        $unwind: {
          path: "$sub_category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "histories",
          let: { itemID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$itemID", "$$itemID"] },
                    { $eq: ["$operation", "archive"] },
                  ],
                },
              },
            },
            {
              $project: {
                date: 1,
                _id: false,
              },
            },
          ],
          as: "deletedDate",
        },
      },
      {
        $unwind: {
          path: "$deletedDate",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          sub_category: "$sub_category",
          category: "$category",
          cost: 1,
          quantity: 1,
          current_worth: 1,
          condition: 1,
          deletedDate: "$deletedDate.date",
        },
      },
    ]);

    // return the result
    return result(false, "all archives", archives);
  } catch (error) {
    return result(
      true,
      `inventoryFun getArchives function => ${error.message}`,
      null
    );
  }
};

module.exports.getInformation = async () => {
  const totaleItems = await inventoryModel.aggregate([
    {
      $group: {
        _id: null,
        total_items: { $sum: 1 },
      },
    },
  ]);

  const condition = await inventoryModel.aggregate([
    {
      $group: {
        _id: "$condition",
        total: { $sum: 1 },
      },
    },
  ]);

  const categories = await inventoryModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        // cat for category
        as: "cat",
      },
    },
    {
      $unwind: {
        path: "$cat",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$cat.name",
        total: { $sum: 1 },
      },
    },
  ]);

  const accounting = await inventoryModel.aggregate([
    {
      $addFields: {
        net_spend: { $multiply: ["$quantity", "$cost"] },
        current_worth: { $multiply: ["$quantity", "$current_worth"] },
        net_loss: {
          $cond: {
            if: { $eq: ["$condition", "Damaged"] },
            then: { $multiply: ["$quantity", "$cost"] },
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        net_spend: { $sum: "$net_spend" },
        current_worth: { $sum: "$current_worth" },
        net_loss: { $sum: "$net_loss" },
      },
    },
  ]);

  const time = new Date().getTime();
  const dif = time - 60 * 60 * 1000 * 24 * 30;

  const item_overview = await inventoryModel.aggregate([
    {
      $lookup: {
        from: "histories",
        let: { item: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$itemID", "$$item"] },
                  { $eq: ["$operation", "add"] },
                ],
              },
            },
          },
          {
            $project: {
              date: 1,
              _id: 0,
            },
          },
        ],
        as: "date",
      },
    },
    {
      $unwind: {
        path: "$date",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        isNew: {
          $cond: { if: { $gte: ["$date.date", dif] }, then: true, else: false },
        },
      },
    },
    {
      $group: {
        _id: null,
        old: {
          $sum: {
            $cond: { if: { $eq: ["$isNew", false] }, then: 1, else: 0 },
          },
        },
        new: {
          $sum: {
            $cond: { if: { $eq: ["$isNew", true] }, then: 1, else: 0 },
          },
        },
      },
    },
  ]);

  return result(false, "get info", {
    totaleItems,
    condition,
    categories,
    accounting,
    item_overview,
  });
};
