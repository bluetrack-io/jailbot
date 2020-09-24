// This is a terrible workaround because the jail server has funky TLS handling
(process.env as any)["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

import * as Fs from 'fs';
import * as Path from 'path';
import * as Knex from 'knex';
import * as Bluebird from 'bluebird';
import { FsMigrations } from 'knex/lib/migrate/sources/fs-migrations';
import config from './config';
import { getInmates } from './utils';
import { InmateDatastoreI } from './interfaces';
import { KnexDatastore } from './entities';

// Insure the data dir exists
if(!Fs.existsSync(config.data_dir)){
  console.info('Data dir does not exist, creating it @', config.data_dir);
  Fs.mkdirSync(config.data_dir, 0o744)
}

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

async function main(datastore:InmateDatastoreI){
  const inmates = await getInmates();
  if(inmates.length == 0){
    console.log('No inmates found');
    return;
  }
  console.log('Fetched', inmates.length, 'records');
  let savedRecords = 0;
  let errorRecords = 0;
  await Bluebird.mapSeries(inmates, async (inmate) => {
    try {
      await datastore.saveRecord(inmate)
      savedRecords++;
    }
    catch(err){
      console.error('Error saving record:', err);
      errorRecords++;
    }
  })
  console.log('Saved', savedRecords, 'records');
  console.log('Failed saving', errorRecords, 'records');
}

Promise.resolve()
// Initialize knex
.then(() => knex.migrate.latest())
.catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
})
.then(() => {
  const memstore = new KnexDatastore(knex);
  return main(memstore)
})
.catch(err => {
  if(err && err.code){
    console.log(err.code, '-', err.message)
  }
  else {
    console.error(err);
  }
})
// Close knex connections
.then(() => knex.destroy())


