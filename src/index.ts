// This is a terrible workaround because the jail server has funky TLS handling
(process.env as any)["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

import * as Fs from 'fs';
import * as Path from 'path';
import * as Knex from 'knex';
import { FsMigrations } from 'knex/lib/migrate/sources/fs-migrations';
import config from './config';
import { RawRecordProviderI } from './interfaces';
import { saveCurrentInmateRecords } from './utils';
import { KnexRawRecordProvider } from './entities';

// Ensure the data dir exists
if(!Fs.existsSync(config.data_dir)){
  console.info('Data dir does not exist, creating it @', config.data_dir);
  Fs.mkdirSync(config.data_dir, 0o744)
}

// Initialize knex
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: Path.resolve(config.data_dir, 'db.sqlite')
  },
  migrations: {
    migrationSource: new FsMigrations(Path.resolve(__dirname, 'knex/migrations'), false)
  },
})

/** Do shutdown logic on the app */
const shutdown = async () => {
  await knex.destroy();
}

// Begin main app execution
Promise.resolve()
.then(() => knex.migrate.latest())
.catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
})
.then(async () => {
  const rawRecords: RawRecordProviderI = new KnexRawRecordProvider(knex);
  const batchId = await saveCurrentInmateRecords(rawRecords);
  console.log('Finished batch', batchId);
  const batchRecords = await rawRecords.getRecordsByBatch(batchId);
  console.log('Saved', batchRecords.length, 'records');
})
.then(() => shutdown())
