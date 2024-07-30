const { default: mongoose } = require("mongoose");
const { userModel } = require("../Models/users");
const { hashPass, comparePass } = require("./PassCrypt");
const { result } = require("./ResultObj");

module.exports.addUser = async (data) => {
  // check if the email already exists
  const userExists = await userModel.findOne({ email: data.email });
  if (userExists) return result(true, `email already used !`, null);

  // create a hash for the password
  const hash = hashPass(data.password);

  // reset the password field in the data object
  data = { ...data, password: hash, role: "user" };

  // create a user model with data object
  const user = new userModel(data);

  try {
    const newUser = await user.save();
    return result(
      false,
      `${newUser.lname} ${newUser.fname} your account will be verified !`,
      null
    );
  } catch (error) {
    return result(true, `usersFun line 6 => ${error.message}`, null);
  }
};

module.exports.verifyUser = async (data) => {
  try {
    // check the user exists
    const user = await userModel.findOne({ email: data.email });
    if (!user) return result(true, "wrong email or password !");

    // check if the password is correct
    const passwordVerified = comparePass(data.password, user.password);
    if (!passwordVerified) return result(true, "wrong email or password !");

    if (!user.verified && user.role !== "admin")
      return result(true, "your account is not verified yet !", user);

    // return the user
    return result(false, `welcome to you ${user.fname} !`, user);
  } catch (error) {
    // return error if server db stops working
    return result(true, `usersFun line 32 => ${error.message}`, null);
  }
};

module.exports.checkUser = async (userID) => {
  try {
    const user = await userModel.findById(mongoose.Types.ObjectId(userID));
    if ((!user || !user.verified) && user.role !== "admin")
      return result(true, `not allowed !`, undefined);

    return result(false, `user authorized`, user);
  } catch (error) {
    return result(true, "usersFun line 50 => " + error.message, null);
  }
};

module.exports.getUsers = async (role, userID) => {
  if (role !== "admin") return result(true, "not allowed !", undefined);

  try {
    const user = await userModel.find({
      _id: { $ne: mongoose.Types.ObjectId(userID) },
    });
    return result(false, "all users", user);
  } catch (error) {
    return result(true, `usersFun getUsers function => ${error.message}`, null);
  }
};

module.exports.deleteUser = async (role, user) => {
  if (role !== "admin") return result(true, "not allowed !", undefined);

  try {
    const deletedUser = await userModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(user),
    });
    return result(
      false,
      `${deletedUser.fname} ${deletedUser.lname} was deleted succefully !`,
      deletedUser
    );
  } catch (error) {
    return result(
      true,
      `usersFun deleteUser function => ${error.message}`,
      null
    );
  }
};

module.exports.editUser = async (role, user) => {
  if (role !== "admin") return result(true, "not allowed !", undefined);

  try {
    const editedUser = await userModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(user),
      },
      {
        $set: {
          verified: true,
        },
      }
    );
    return result(
      false,
      `${editedUser.fname} ${editedUser.lname} was verified succefully !`,
      editedUser
    );
  } catch (error) {
    return result(true, `usersFun editUser function => ${error.message}`, null);
  }
};

module.exports.addAdmin = async () => {
  try {
    const admin = await userModel.findOne({ role: "admin" });
    if (admin) return;
    const hashedPass = hashPass("admin");
    const newAdmin = new userModel({
      verified: true,
      email: "admin@admin.com",
      fname: "admin",
      lname: "admin",
      password: hashedPass,
      role: "admin",
    });

    await newAdmin.save();
  } catch (error) {
    console.log(error);
  }
};
