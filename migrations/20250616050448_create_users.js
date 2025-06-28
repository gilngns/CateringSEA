/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('full_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.enu('role', ['USER', 'ADMIN']).defaultTo('USER');
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('users');
}
