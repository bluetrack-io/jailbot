import * as Knex from 'knex';

export async function up(knex:Knex){
  await knex.schema.createTable('mugshot_hashes', table => {
    table.string('hash').primary().unique().notNullable().comment('SHA256');
    table.string('data').notNullable();
  })

  await knex.schema.createTable('raw_records', table => {
    table.string('datetimebooked');
    table.string('name').notNullable();
    table.string('mugshotpath').references('mugshot_hashes.hash');
    table.string('amount');
    table.string('outstandingbonds');
    table.string('outstandingdetainers');
    table.string('bookhandle').notNullable();
    table.string('bookno').notNullable();
    table.string('charges');
    table.string('detainers');

    // runtime metadata
    table.uuid('id').primary().unique().notNullable();
    table.uuid('batch_id').notNullable();
    table.timestamp('saved_at').defaultTo(knex.fn.now()).notNullable();
  })
}

export async function down(knex:Knex){
  await knex.schema.dropTableIfExists('raw_records');
  await knex.schema.dropTableIfExists('mugshot_hashes');
}
