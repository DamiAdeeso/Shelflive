const { historyModel } = require("../Models/history");
const { result } = require("./ResultObj");

module.exports.addToHistory = async (
  userID,
  itemID,
  action,
  operation,
  extra
) => {
  try {
    const history = new historyModel({
      action,
      userID,
      itemID,
      date: new Date().getTime(),
      operation,
      itemAfterChange: extra?.after,
      itemBeforeChange: extra?.before,
    });
    await history.save();
    return result(false, "success", null);
  } catch (error) {
    return result(true, `hitoryFun line 4 => ${error.message}`, null);
  }
};

module.exports.getHistory = async (role, match) => {
  try {
    let history = await historyModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                role: 1,
                name: { $concat: ["$fname", " ", "$lname"] },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "itemID",
          foreignField: "_id",
          as: "existing",
        },
      },
      {
        $unwind: {
          path: "$existing",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "archives",
          localField: "itemID",
          foreignField: "_id",
          as: "archive",
        },
      },
      {
        $unwind: {
          path: "$archive",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          item: {
            $cond: {
              if: { $not: ["$existing._id"] },
              then: "$archive",
              else: "$existing",
            },
          },
        },
      },
      {
        $addFields: {
          categoryID: "$item.category",
          categoryID_: {
            $cond: {
              if: { $not: ["$itemBeforeChange._id"] },
              then: "$itemAfterChange._id",
              else: "$itemBeforeChange._id",
            },
          },
        },
      },
      {
        $addFields: {
          categoryExists: {
            $cond: {
              if: { $not: ["$categoryID"] },
              then: { $toObjectId: "$categoryID_" },
              else: "$categoryID",
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryExists",
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
        $match:
          role === "admin"
            ? {
                $expr: {
                  $or: [
                    { $eq: ["$user.role", "admin"] },
                    { $eq: ["$user.role", "user"] },
                  ],
                },
              }
            : {
                $expr: { $eq: ["$user.role", "user"] },
              },
      },
      {
        $project: {
          date: 1,
          action: 1,
          operation: 1,
          user: "$user.name",
          itemBeforeChange: 1,
          itemAfterChange: 1,
          item: "$item",
          category: "$category.name",
          categoryExists: "$categoryExists",
          categoryID_: "$categoryID_",
        },
      },
    ]);

    if (match) {
      history = history.filter((val) => {
        return (
          (val.item?.name.toUpperCase().includes(match.name) ||
            val.itemBeforeChange?.name.toUpperCase().includes(match.name) ||
            val.itemAfterChange?.name.toUpperCase().includes(match.name)) &&
          val.category?.toUpperCase().includes(match.category) &&
          (val.item?.condition.toUpperCase().includes(match.condition) ||
            val.itemBeforeChange?.condition
              .toUpperCase()
              .includes(match.condition) ||
            val.itemAfterChange?.condition
              .toUpperCase()
              .includes(match.condition)) &&
          val.date >= match.start &&
          val.date <= match.end
        );
      });
    }

    let temp = [];
    const finalArray = [];
    for (let i = 0; i < history.length; i++) {
      const val = history[i];
      let dif = new Date().getTime() - val.date;
      dif = Math.round(dif / (1000 * 3600 * 24));
      const day = timeFormat(dif);
      const time = dayFormat(val.date);
      if (temp.length) {
        if (temp[0].time !== time) {
          finalArray.push(temp);
          temp = [{ ...val, day, time }];
        } else {
          temp.push({ ...val, day, time });
        }
      } else temp.push({ ...val, day, time });

      if (i === history.length - 1) finalArray.push(temp);
    }

    return result(false, "hitory", finalArray);
  } catch (error) {
    return result(
      true,
      `historyFun.js in getHistory function => ${error.message}`,
      null
    );
  }
};

const timeFormat = (num) => {
  const f = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  const format =
    num < 7
      ? { f: "day", n: num }
      : num > 7 && num < 30
      ? { f: "week", n: Math.floor(num / 7) }
      : num > 30 && num < 365
      ? { f: "month", n: Math.floor(num / 30) }
      : { f: "year", n: Math.floor(num / 365) };
  return f.format(-format.n, format.f);
};

const dayFormat = (time) => {
  const f = new Intl.DateTimeFormat("en", {
    dateStyle: "short",
  });
  return f.format(time);
};
