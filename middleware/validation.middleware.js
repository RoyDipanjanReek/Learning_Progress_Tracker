import { validationResult, body, query } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const error = validationResult(req);

    if (error.isEmpty()) {
      return next();
    }

    const extractedError = error.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new Error("validation error");
  };
};

export const commonValidation = {
  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive number"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be between 1 and 100"),
  ],
  email: body("email")  
    .isEmail()
    .normalizeEmail()
    .withMessage("please provide a valid email"),
  name: body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("please provide a valid name"),
};


export const validateSignUp = validate([
    commonValidation.email,
    commonValidation.name
]);