const { body } = require('express-validator');
const User = require('../models/userDB');

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Type correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Such email already exists');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body('password', 'Password must be 6 characters or more')
    .isLength({ min: 6, max: 32 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password mismatches');
      }
      return true;
    })
    .trim(),
  body('name').isLength({ min: 3 }).withMessage('Name must be 3 characters or more').trim(),
];

exports.courseValidators = [
  body('title').isLength({ min: 3 }).withMessage('Title must be 3 characters or more').trim(),
  body('price').isNumeric().withMessage('Type correct price'),
  body('img', 'Type correct image URL ').isURL()
];
