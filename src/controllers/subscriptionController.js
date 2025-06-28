import Subscription from '../models/subscriptionModel.js';
import MealPlan from '../models/mealPlanModel.js';

const subscriptionController = {
  index: async (req, res) => {
    const subscriptions = await Subscription.findAll();
    res.json(subscriptions);
  },

  show: async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    res.json(subscription);
  },

  create: async (req, res) => {
    try {
      const {
        phone_number,
        plan_id,
        meal_type, 
        delivery_days,
        allergies
      } = req.body;

      const mealTypes = Array.isArray(meal_type)
        ? meal_type
        : typeof meal_type === 'string'
        ? [meal_type]
        : [];

      const days = Array.isArray(delivery_days)
        ? delivery_days
        : typeof delivery_days === 'string'
        ? [delivery_days]
        : [];

      const plan = await MealPlan.findById(plan_id);
      if (!plan) {
        return res.status(400).json({ error: 'Invalid plan ID' });
      }

      const planPrice = parseFloat(plan.price);
      const totalPrice = planPrice * mealTypes.length * days.length * 4.3;

      const subscription = await Subscription.create({
        user_id: req.user.id,
        phone_number,
        plan_id,
        meal_type: mealTypes.join(','),
        delivery_days: days.join(','),
        allergies,
        total_price: totalPrice,
        status: 'ACTIVE',
        start_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });

      res.status(201).json({
        message: 'Subscription created successfully',
        data: subscription
      });
    } catch (error) {
      console.error('❌ Subscription Error:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const now = new Date();
  
      const updateData = {
        status,
        updated_at: now,
      };
  
      if (status === 'PAUSE') {
        updateData.pause_period_start = now;
        updateData.pause_period_end = null;
      } else if (status === 'ACTIVE') {
        updateData.pause_period_end = now;
      }
  
      if (status === 'END' || status === 'CANCEL') {
        updateData.end_date = now;
      }
  
      await Subscription.update(id, updateData);
  
      res.json({ message: 'Subscription updated' });
    } catch (error) {
      console.error('❌ Gagal update subscription:', error);
      res.status(500).json({ message: 'Gagal update subscription' });
    }
  },  

  delete: async (req, res) => {
    await Subscription.delete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  }
};

export default subscriptionController;
