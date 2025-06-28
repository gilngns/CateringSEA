/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('subscriptions', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('phone_number');
        table.integer('plan_id').unsigned().references('id').inTable('meal_plans').onDelete('CASCADE');
        table.string('meal_type');
        table.string('delivery_days'); 
        table.text('allergies');
        table.enu('status', ['ACTIVE', 'PAUSE', 'CANCEL']).defaultTo('ACTIVE');
        table.date('start_date');
        table.date('end_date');
        table.date('pause_period_start');
        table.date('pause_period_end');
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('subscriptions');
}
