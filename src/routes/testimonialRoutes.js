import express from 'express';
import testimonialController from '../controllers/testimonialController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', testimonialController.index);
router.get('/:id', testimonialController.show);
router.post('/', authMiddleware, testimonialController.create);
router.put('/:id', testimonialController.update);
router.delete('/:id', testimonialController.delete);

export default router;