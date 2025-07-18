import express from 'express';
import { registerValidation } from '../middleware/userValidator.js';
import { validationResult } from 'express-validator';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }
  userController.create(req, res);
});

router.post('/login', userController.login);
router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logout berhasil' });
});
router.get('/check-auth', authMiddleware, (req, res) => {
  res.status(200).json({ loggedIn: true, user: req.user });
});

router.get('/', userController.index);
router.get('/:id', userController.show);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;