const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  let name = isEmtpy(data.name) ? "" : data.name;
  let email = isEmtpy(data.email) ? "" : data.email;
  let password = isEmtpy(data.password) ? "" : data.password;
  let password2 = isEmtpy(data.password2) ? "" : data.password2;

  if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(name)) {
    errors.name = "Name field is required";
  }

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

  if (Validator.isEmpty(password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};
