const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports.hashPass = (password) => {
  return bcrypt.hashSync(password, salt);
};

module.exports.comparePass = (password, dbPass) => {
  return bcrypt.compareSync(password, dbPass);
};
