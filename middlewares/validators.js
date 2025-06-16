const { body } = require('express-validator');

const loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password length should be at least 6 characters')
];

module.exports = { loginValidationRules };