import express from 'express';
import subscriptionController from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/', subscriptionController.index);
router.get('/:id', subscriptionController.show);
router.post('/', subscriptionController.create);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.delete);

export default router;
