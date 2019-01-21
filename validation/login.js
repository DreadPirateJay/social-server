const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  let email = isEmtpy(data.email) ? "" : data.email;
  let password = isEmtpy(data.password) ? "" : data.password;

  if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};
