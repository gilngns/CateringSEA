import db from '../db/knex.js';

const User = {
  findAll: () => db('users'),
  findById: (id) => db('users').where({ id }).first(),
  create: (data) => db('users').insert(data),
  update: (id, data) => db('users').where({ id }).update(data),
  delete: (id) => db('users').where({ id }).del()
};

export default User;