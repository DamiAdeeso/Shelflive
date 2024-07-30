const { default: mongoose } = require("mongoose");

module.exports.result = (err, message, result) => {
  // create a unique id for the message to update it easly
  const id = mongoose.Types.ObjectId();

  // return the objecth
  return JSON.stringify({
    err,
    message: {
      id,
      message,
    },
    result,
  });
};
