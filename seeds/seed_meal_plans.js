/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('meal_plans').del();
  await knex('meal_plans').insert([
    {
      id: 1,
      name: 'Healthy Pack',
      price: 150000,
      description: 'Paket sehat untuk harian',
      image_url: 'healthy.jpg'
    },
    {
      id: 2,
      name: 'Protein Boost',
      price: 180000,
      description: 'Tinggi protein dan energi',
      image_url: 'protein.jpg'
    }
  ]);
};
