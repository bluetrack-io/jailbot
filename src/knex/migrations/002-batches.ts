import * as Knex from 'knex';

export async function up(knex:Knex){
  await knex.schema.createTable('batches', table => {
    table.uuid('id').primary().unique().notNullable();
    table.timestamp('saved_at').defaultTo(knex.fn.now()).notNullable();
  })
}

export async function down(knex:Knex){
  await knex.schema.dropTableIfExists('batches');
}
