import express from 'express';
import mealPlanController from '../controllers/mealPlanController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', mealPlanController.index);
router.get('/:id', mealPlanController.show);
router.post('/', upload.single('image_url'), mealPlanController.create);
router.put('/:id', upload.single('image_url'), mealPlanController.update);
router.delete('/:id', mealPlanController.delete);

export default router;
