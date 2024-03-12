const joi = require("joi");

const clientRegisterValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(4).max(26).messages({
      "string.empty": "common:Enter_a_valid_username",
      "string.min": "common:Enter_a_valid_username_min_4_characters",
      "string.max": "common:Enter_a_valid_username_max_26_characters",
    }),
    firstName: joi.string().required().min(4).max(26).messages({
      "string.empty": "common:Enter_a_valid_first_name",
      "string.min": "common:Enter_a_valid_first_name_min_4_characters",
      "string.max": "common:Enter_a_valid_first_name_max_26_characters",
    }),
    lastName: joi.string().required().min(4).max(26).messages({
      "string.empty": "common:Enter_a_valid_last_name",
      "string.min": "common:Enter_a_valid_last_name_min_4_characters",
      "string.max": "common:Enter_a_valid_last_name_max_26_characters",
    }),
    email: joi.string().required().email().messages({
      "string.empty": "common:Enter_a_valid_email",
      "string.email": "common:Enter_a_valid_email",
    }),
    phone: joi.number().required().messages({
      "string.empty": "common:Enter_a_valid_phone",
    }),
    password: joi.string().required().min(8).max(26).messages({
      "string.empty": "common:Enter_a_valid_password",
      "string.min": "common:Enter_a_valid_password_min_8_characters",
      "string.max": "common:Enter_a_valid_password_max_26_characters",
    }),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "string.empty": "common:Enter_a_valid_confirm_password",
        "any.only": "common:Password_and_confirm_password_must_be_the_same",
      }),
  });
  return schemaValidation.validate(data);
};

module.exports.clientRegisterValidation = clientRegisterValidation;
