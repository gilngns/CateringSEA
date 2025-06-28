import express from 'express';
import subscriptionController from '../controllers/subscriptionController.js';
import requireLogin from '../middleware/requireLogin.js';
import Subscription from '../models/subscriptionModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    let data;
    if (user.role === 'ADMIN') {
      data = await Subscription.findAll(); // admin lihat semua
    } else {
      data = await Subscription.findByUserId(user.id); // user hanya lihat miliknya
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Gagal ambil data subscriptions:', err);
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});
  
router.get('/:id', subscriptionController.show);
router.post('/',authMiddleware, requireLogin, subscriptionController.create);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.delete);

export default router;
