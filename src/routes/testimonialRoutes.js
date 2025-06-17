import express from 'express';
import testimonialController from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', testimonialController.index);
router.get('/:id', testimonialController.show);
router.post('/', testimonialController.create);
router.put('/:id', testimonialController.update);
router.delete('/:id', testimonialController.delete);

export default router;