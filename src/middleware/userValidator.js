import { body } from 'express-validator';

export const registerValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Nama wajib diisi'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid'),

  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
];
