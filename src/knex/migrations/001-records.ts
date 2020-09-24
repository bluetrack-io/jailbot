import * as Knex from 'knex';

export async function up(knex:Knex){
  await knex.schema.createTable('records', table => {
    table.string('datetimebooked');
    table.string('name').notNullable();
    table.string('mugshotpath');
    table.string('amount');
    table.string('outstandingbonds');
    table.string('outstandingdetainers');
    table.string('bookhandle').notNullable();
    table.string('bookno').notNullable();
    table.string('charges');
    table.string('detainers');

    // runtime metadata
    table.uuid('runtime_batch').notNullable();
    table.timestamp('saved_at').defaultTo(knex.fn.now()).notNullable();
  })
}

export async function down(knex:Knex){
  await knex.schema.dropTableIfExists('records');
}
