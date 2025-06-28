/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('meal_plans', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.string('description');
        table.string('image_url');
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('meal_plans');
}
