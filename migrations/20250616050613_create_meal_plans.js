/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('meal_plans', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.double('price').notNullable();
        table.string('description');
        table.string('image_url');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('meal_plans');
};
