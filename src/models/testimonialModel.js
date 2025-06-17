import db from '../db/knex.js';

const Testimonial = {
  findAll: () => db('testimonials'),
  findById: (id) => db('testimonials').where({ id }).first(),
  create: (data) => db('testimonials').insert(data),
  update: (id, data) => db('testimonials').where({ id }).update(data),
  delete: (id) => db('testimonials').where({ id }).del()
};

export default Testimonial;