const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  let text = isEmtpy(data.text) ? "" : data.text;

  if (!Validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};

