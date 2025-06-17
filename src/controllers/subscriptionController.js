import Subscription from '../models/subscriptionModel.js';

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
    await Subscription.create(req.body);
    res.status(201).json({ message: 'Subscription created' });
  },

  update: async (req, res) => {
    await Subscription.update(req.params.id, req.body);
    res.json({ message: 'Subscription updated' });
  },

  delete: async (req, res) => {
    await Subscription.delete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  }
};

export default subscriptionController;
