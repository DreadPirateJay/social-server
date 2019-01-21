const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  let school = isEmtpy(data.school) ? "" : data.school;
  let degree = isEmtpy(data.degree) ? "" : data.degree;
  let fieldofstudy = isEmtpy(data.fieldofstudy) ? "" : data.fieldofstudy;
  let from = isEmtpy(data.from) ? "" : data.from;

  if (Validator.isEmpty(school)) {
    errors.school = "Field 'school' is required";
  }

  if (Validator.isEmpty(degree)) {
    errors.degree = "Field 'company' is required";
  }

  if (Validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Field 'fieldofstudy' is required";
  }

  if (Validator.isEmpty(from)) {
    errors.from = "Field 'from' is required";
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};
