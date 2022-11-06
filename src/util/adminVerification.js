const joi = require("joi");

const adminRegisterValidation = (data) => {
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
    phone: joi.number().required().messages({
      "string.empty": "common:Enter_a_valid_phone",
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
    //password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, and must be eight characters or longer
    password: joi
      .string()
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        )
      )
      .messages({
        "string.empty": "common:Enter_a_valid_password",
        "string.pattern.base":
          "common:Enter_a_valid_password_min_8_characters_one_lowercase_one_uppercase_one_numeric_one_special_character",
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
const LoginValidation = (data) => {
  const schemaValidation = joi.object({
    email: joi.string().required().email().messages({
      "string.empty": "common:Enter_a_valid_email",
      "string.email": "common:Enter_a_valid_email",
    }),
    password: joi.string().required().min(8).max(26).messages({
      "string.empty": "common:Enter_a_valid_password",
      "string.min": "common:Enter_a_valid_password_min_8_characters",
      "string.max": "common:Enter_a_valid_password_max_26_characters",
    }),
  });
  return schemaValidation.validate(data);
};

module.exports.adminRegisterValidation = adminRegisterValidation;

module.exports.LoginValidation = LoginValidation;
