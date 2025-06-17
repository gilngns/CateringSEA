/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.alterTable('subscriptions', table => {
      table.dropColumn('meal_type');
    });
  }
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.alterTable('subscriptions', table => {
      table.string('meal_type');
    });
  }
