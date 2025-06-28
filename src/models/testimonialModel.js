import db from '../db/knex.js';

const Testimonial = {
  async findAll() {
    return await db('testimonials')
      .join('users', 'testimonials.user_id', '=', 'users.id')
      .select(
        'testimonials.id',
        'testimonials.rating',
        'testimonials.review',
        'testimonials.created_at',
        'users.full_name as name' 
      )
      .orderBy('testimonials.created_at', 'desc');
  },
  findById: (id) => db('testimonials').where({ id }).first(),
  create: (data) => db('testimonials').insert(data),
  update: (id, data) => db('testimonials').where({ id }).update(data),
  delete: (id) => db('testimonials').where({ id }).del()
};

export default Testimonial;