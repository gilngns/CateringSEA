import MealPlan from '../models/mealPlanModel.js';
import fs from 'fs/promises';
import path from 'path';

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
    console.log('Body:', req.body);
    console.log('File:', req.file); 
    console.log('Headers:', req.headers['content-type']);

  
    const { name, description, price } = req.body;
    const image_url = req.file ? req.file.filename : null;
  
    try {
      await MealPlan.create({ name, description, price, image_url });
      res.status(201).json({ message: 'Meal plan created' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const image_url = req.file ? req.file.filename : null;
  
      // Ambil data lama untuk hapus gambar lama jika ada
      const oldData = await MealPlan.findById(req.params.id);
      const updatedData = { name, description, price };
  
      // Gunakan path root project, karena folder 'uploads' ada di luar src
      const uploadsDir = path.join(process.cwd(), 'uploads');
  
      if (image_url) {
        // Hapus gambar lama jika ada
        if (oldData?.image_url) {
          const oldImagePath = path.join(uploadsDir, oldData.image_url);
          try {
            await fs.unlink(oldImagePath);
            console.log('✅ Gambar lama dihapus:', oldData.image_url);
          } catch (err) {
            console.warn('⚠️ Gagal hapus gambar lama:', err.message);
          }
        }
  
        updatedData.image_url = image_url;
      }
  
      await MealPlan.update(req.params.id, updatedData);
      res.json({ message: 'Meal Plan updated' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    await MealPlan.delete(req.params.id);
    res.json({ message: 'Meal Plan deleted' });
  }
};

export default mealPlanController;
