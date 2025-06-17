import Testimonial from '../models/testimonialModel.js';

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
    await Testimonial.create(req.body);
    res.status(201).json({ message: 'Testimonial created' });
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
