/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('testimonials').del();
  await knex('testimonials').insert([
    { id: 1, user_id: 1, review: 'Makanannya enak dan sehat!', rating: 5 },
    { id: 2, user_id: 1, review: 'Cocok buat diet keto.', rating: 4 }
  ]);
};

