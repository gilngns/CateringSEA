import db from '../db/knex.js';

const User = {
  create: (data) => db('users').insert(data),
  findByEmail: (email) => db('users').where({ email }).first(),
  findAll: () => db('users'),
  findById: (id) => db('users').where({ id }).first(),
  update: (id, data) => db('users').where({ id }).update(data),
  delete: (id) => db('users').where({ id }).del()
};

export default User;
