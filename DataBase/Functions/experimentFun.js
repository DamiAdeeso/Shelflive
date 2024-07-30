const { experimentModel } = require("../Models/experiment");
const { studentModel } = require("../Models/student");
const { result } = require("./ResultObj");
// experimentFun.js
module.exports.getExperiment = async () => {
  try {
    const experiments = await experimentModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "expID",
          as: "students",
        },
      },
      {
        $project: {
          title: 1,
          handler: 1,
          level: 1,
          items: 1,
          date: 1,
          students: "$students",
        },
      },
    ]);
    return result(false, "get experiments", experiments);
  } catch (err) {
    return result(
      true,
      `experimentFun.js getExperiment function => ${err.message}`,
      null
    );
  }
};

module.exports.addExperiment = async (data) => {
  const date = new Date().getTime();
  const experiment = new experimentModel({ ...data, date });
  try {
    const newExp = await experiment.save();
    return result(false, "experiment added successfully !", newExp);
  } catch (error) {
    return result(
      true,
      `experimentFun.js addExperiment function => ${error.message}`,
      null
    );
  }
};

module.exports.addStudent = async (data) => {
  const student = new studentModel(data);
  try {
    const newStudent = await student.save();
    return result(false, "student added successfully !", newStudent);
  } catch (error) {
    return result(
      true,
      `experimentFun.js addStudent function => ${error.message}`,
      null
    );
  }
};

module.exports.editStudent = async (data, studentID) => {
  try {
    const student = await studentModel.findOneAndUpdate(
      { _id: studentID },
      {
        $set: data,
      }
    );
    return result(
      false,
      `${student.fname} information edited successfully !`,
      student
    );
  } catch (error) {
    return result(
      true,
      `experimentFun.js editStudent function => ${error.message}`,
      null
    );
  }
};

module.exports.deleteStudent = async (studentID) => {
  try {
    const student = await studentModel.findOneAndDelete({ _id: studentID });
    return result(false, `${student.fname} is deleted successfully !`, student);
  } catch (error) {
    return result(
      true,
      `experimentFun.js deleteStudent function => ${error.message}`,
      null
    );
  }
};
