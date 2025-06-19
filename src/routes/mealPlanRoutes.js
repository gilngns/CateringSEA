// src/routes/mealPlanRoutes.js
import express from 'express';
import mealPlanController from '../controllers/mealPlanController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', mealPlanController.index);
router.get('/:id', mealPlanController.show);
router.post('/', upload.single('image'), mealPlanController.create);
router.put('/:id', upload.single('image'), mealPlanController.update);
router.delete('/:id', mealPlanController.delete);

export default router;
