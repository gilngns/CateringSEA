import db from '../db/knex.js';

const MealPlan = {
  findAll: () => db('meal_plans'),
  findById: (id) => db('meal_plans').where({ id }).first(),
  create: (data) => db('meal_plans').insert(data),
  update: (id, data) => db('meal_plans').where({ id }).update(data),
  delete: (id) => db('meal_plans').where({ id }).del()
};

export default MealPlan;
