const joi = require("joi");

const hotelRegisterValidation = (data) => {
  const schemaValidation = joi.object({
    hotelName: joi.string().required().min(4).max(26).messages({
      "string.empty": `common:Enter_a_valid_hotel_name`,
      "string.min": `common:Enter_a_valid_hotel_name_of_min_4_characters`,
      "string.max": `common:Enter_a_valid_hotel_name_of_max_26_characters`,
    }),
    hotelAddress: joi.string().required().min(4).max(26).messages({
      "string.empty": `common:Enter_a_valid_hotel_address`,
      "string.min": `common:Enter_a_valid_hotel_address_of_min_4_characters`,
      "string.max": `common:Enter_a_valid_hotel_address_of_max_26_characters`,
    }),
    hotelPhone: joi.number().required().messages({
      "string.empty": `common:Enter_a_valid_hotel_phone`,
    }),
    hotelCity: joi.string().required().min(4).max(26).messages({
      "string.empty": `common:Enter_a_valid_hotel_city`,
      "string.min": `common:Enter_a_valid_hotel_city_of_min_4_characters`,
      "string.max": `common:Enter_a_valid_hotel_city_of_max_26_characters`,
    }),
    hotelStars: joi.number().min(1).max(5).required().messages({
      "string.empty": `common:Enter_a_valid_hotel_stars`,
      "string.min": `common:Enter_a_valid_hotel_start_of_min_1_star`,
      "string.max": `common:Enter_a_valid_hotel_start_of_max_5_star`,
    }),
    hotelRooms: joi.number().required().messages({
      "string.empty": `common:Enter_a_valid_hotel_rooms`,
    }),
    hotelPrice: joi.number().required().messages({
      "string.empty": `common:Enter_a_valid_hotel_price`,
    }),
    hotelDescription: joi.string().required().messages({
      "string.empty": `common:Enter_a_valid_hotel_description`,
    }),

    hotelEmail: joi.string().required().email().messages({
      "string.empty": "common:enter_valid_email",
      "string.email": "common:enter_valid_email",
    }),
    password: joi.string().required().min(8).max(26).messages({
      "string.empty": "common:enter_valid_password",
      "string.min": "common:enter_valid_password_min_8_characters",
      "string.max": "common:enter_valid_password_max_8_characters",
    }),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "string.empty": "common:enter_valid_password",
        "any.only": "common:password_does_not_match",
      }),
  });
  return schemaValidation.validate(data);
};

module.exports.hotelRegisterValidation = hotelRegisterValidation;
