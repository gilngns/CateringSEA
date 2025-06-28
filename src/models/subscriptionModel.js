import db from '../db/knex.js';

const Subscription = {
  
  async findAll() {
    return await db('subscriptions')
      .join('users', 'subscriptions.user_id', '=', 'users.id')
      .join('meal_plans', 'subscriptions.plan_id', '=', 'meal_plans.id')
      .select(
        'subscriptions.*',
        'users.full_name as user_name', 
        'meal_plans.name as plan_name',
        'meal_plans.price as plan_price'
      )
      .orderBy('subscriptions.created_at', 'desc');
  },

  findById: (id) => {
    return db('subscriptions')
      .leftJoin('users', 'subscriptions.user_id', 'users.id')
      .select('subscriptions.*', 'users.full_name as user_name')
      .where('subscriptions.id', id)
      .first();
  },

  findByUserId: (userId) => {
    return db('subscriptions')
      .leftJoin('users', 'subscriptions.user_id', 'users.id')
      .leftJoin('meal_plans', 'subscriptions.plan_id', 'meal_plans.id') 
      .where('subscriptions.user_id', userId)
      .select(
        'subscriptions.*',
        'users.full_name as user_name',       
        'meal_plans.name as plan_name'
      )
      .orderBy('subscriptions.id', 'desc');
  },
  

  create: async (data) => {
    const [id] = await db('subscriptions').insert(data);
    return Subscription.findById(id); 
  },

  update: async (id, data) => {
    await db('subscriptions').where({ id }).update(data);
    return Subscription.findById(id); 
  },

  delete: (id) => db('subscriptions').where({ id }).del()
};

export default Subscription;
