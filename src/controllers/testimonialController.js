import Testimonial from '../models/testimonialModel.js';
import User from '../models/userModel.js';

const testimonialController = {
  index: async (req, res) => {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  },

  show: async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    res.json(testimonial);
  },

  create: async (req, res) => {
    try {
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized. Please login.' });
      }
  
      const { rating, review } = req.body;
  
      if (!rating || !review) {
        return res.status(400).json({ message: 'Rating dan review wajib diisi' });
      }
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        console.error('❌ User tidak ditemukan di DB');
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
  
      await Testimonial.create({
        rating,
        review,
        user_id: req.user.id
      });
  
      res.status(201).json({ message: 'Testimonial created' });
    } catch (err) {
      console.error('❌ Error saat create testimonial:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },  

  update: async (req, res) => {
    await Testimonial.update(req.params.id, req.body);
    res.json({ message: 'Testimonial updated' });
  },

  delete: async (req, res) => {
    await Testimonial.delete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  }
};

export default testimonialController;
