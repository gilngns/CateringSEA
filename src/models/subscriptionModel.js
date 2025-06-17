import db from '../db/knex.js';

const Subscription = {
  findAll: () => db('subscriptions'),
  findById: (id) => db('subscriptions').where({ id }).first(),
  create: (data) => db('subscriptions').insert(data),
  update: (id, data) => db('subscriptions').where({ id }).update(data),
  delete: (id) => db('subscriptions').where({ id }).del()
};

export default Subscription;