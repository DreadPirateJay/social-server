const Validator = require("validator");
const isEmtpy = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};
  let handle = isEmtpy(data.handle) ? "" : data.handle;
  let status = isEmtpy(data.status) ? "" : data.status;
  let skills = isEmtpy(data.skills) ? "" : data.skills;

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 and 40 characters";
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = "Handle field is required";
  }

  if (Validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmtpy(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }

  if (!isEmtpy(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }

  if (!isEmtpy(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid url";
    }
  }

  if (!isEmtpy(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }

  if (!isEmtpy(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }

  if (!isEmtpy(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }

  return {
    errors,
    isValid: isEmtpy(errors)
  };
};
