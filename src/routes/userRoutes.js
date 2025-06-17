import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
