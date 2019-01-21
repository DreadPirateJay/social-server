const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validateExperieceInput(data) {
  let errors = {};
  let title = isEmtpy(data.title) ? "" : data.title;
  let company = isEmtpy(data.company) ? "" : data.company;
  let from = isEmtpy(data.from) ? "" : data.from;

  if (Validator.isEmpty(title)) {
    errors.title = "Field 'title' is required";
  }

  if (Validator.isEmpty(company)) {
    errors.company = "Field 'company' is required";
  }

  if (Validator.isEmpty(from)) {
    errors.from = "Field 'from' is required";
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};
