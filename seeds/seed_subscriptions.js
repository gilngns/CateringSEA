/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Kosongkan tabel dulu
  await knex('subscriptions').del();

  // Masukkan data
  await knex('subscriptions').insert([
    {
      id: 1,
      user_id: 1,
      phone_number: '08123456789',
      plan_id: 1,
      delivery_days: 'Monday,Wednesday,Friday',
      allergies: 'Peanuts',
      status: 'ACTIVE', 
      start_date: '2024-06-01',
      end_date: '2024-07-01',
      pause_period_start: null,
      pause_period_end: null
    },
    {
      id: 2,
      user_id: 1,
      phone_number: '08123456789',
      plan_id: 2,
      delivery_days: 'Tuesday,Thursday',
      allergies: '',
      status: 'PAUSE',
      start_date: '2024-06-10',
      end_date: '2024-07-10',
      pause_period_start: '2024-06-20',
      pause_period_end: '2024-06-25'
    }
  ]);
};

