/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').del();
  await knex('users').insert([
    { id: 1, full_name: 'John Doe', email: 'john@example.com', password: 'hashedpassword', role: 'USER' },
    { id: 2, full_name: 'Admin User', email: 'admin@example.com', password: 'hashedadmin', role: 'ADMIN' },
    { id: 3, full_name: 'Budi', email: 'user@example.com', password: 'hasheduser', role: 'USER' }
  ]);
};

