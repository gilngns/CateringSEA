import MealPlan from '../models/mealPlanModel.js';

const mealPlanController = {
  index: async (req, res) => {
    const plans = await MealPlan.findAll();
    res.json(plans);
  },

  show: async (req, res) => {
    const plan = await MealPlan.findById(req.params.id);
    res.json(plan);
  },

  create: async (req, res) => {
    console.log('Uploaded file:', req.file); 
  
    const { name, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;
  
    await MealPlan.create({ name, description, price, image_url });
    res.status(201).json({ message: 'Meal plan created' });
  },
  

  update: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const image_url = req.file ? req.file.filename : null;

      const updatedData = { name, description, price };
      if (image_url) updatedData.image_url = image_url;

      await MealPlan.update(req.params.id, updatedData);
      res.json({ message: 'Meal Plan updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    await MealPlan.delete(req.params.id);
    res.json({ message: 'Meal Plan deleted' });
  }
};

export default mealPlanController;
