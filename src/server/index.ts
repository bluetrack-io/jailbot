import * as Fs from 'fs';
import * as Path from 'path';
import * as Bluebird from 'bluebird';
import * as Knex from 'knex';
import { Server } from 'http';
import { FsMigrations } from 'knex/lib/migrate/sources/fs-migrations';
import * as Prom from 'prom-client';
import ExpApp from './ExpApp';
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

const runBatch = async (rawRecords:RawRecordProviderI) => {
  const batchId = await saveCurrentInmateRecords(rawRecords);
  console.log('Finished batch', batchId);
  const batchRecords = await rawRecords.getRecordsByBatch(batchId);
  console.log('Saved', batchRecords.length, 'records');
}

/** Do shutdown logic on the app */
const shutdown = async (server?:Server) => {
  if(server && typeof server.close === 'function'){
    await (new Promise(resolve=>server.close(()=>resolve())))
  }
  await knex.destroy();
  process.exit();
}

// Begin main app execution
Promise.resolve()
.then(async () => {
  // When running with ts-node then the migrations will have .ts extensions instead of .js
  // If you try to run dev mode against a prod db, it will throw an error because of this difference

  // Do nothing if not using ts-node
  if(!process[Symbol.for('ts-node.register.instance')]){
    return;
  }
  // Do nothing if not dev mode or knex_migrations table does not exist
  if(!config.dev_mode || !(await knex.schema.hasTable('knex_migrations')) ){
    return;
  }
  // Find .js migrations (if any)
  const jsMigrations = (await knex('knex_migrations').select('name').where('name','like','%.js')).map(r => r.name)
  if(jsMigrations.length == 0){
    return;
  }
  console.log(`${jsMigrations.length} js migrations to be modified`)
  await Bluebird.mapSeries(
    jsMigrations.map(oldName=>({oldName,newName:oldName.replace('.js','.ts')})),
    set => knex('knex_migrations').update('name',set.newName).where('name',set.oldName)
  )
  console.log('Finished changing migration extensions')
})
.then(() => knex.migrate.latest())
.catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
})
.then(async () => {
  const rawRecords: RawRecordProviderI = new KnexRawRecordProvider(knex);

  if(config.http.enabled){
    console.log('Starting HTTP server');
    Prom.collectDefaultMetrics()
    const app = ExpApp(Path.resolve(config.data_dir, 'db.sqlite'), Prom.register, rawRecords, knex);
    const server = app.listen(config.http.port, () => {
      console.log('Server listening on', config.http.port);
      if(!config.dev_mode && config.batch_interval_seconds > 0){
        runBatch(rawRecords).then(() => (
          setInterval(() => runBatch(rawRecords), config.batch_interval_seconds * 1000)
        ))
      }
    })
    return server;
  }
  else {
    await runBatch(rawRecords);
    return shutdown();
  }
})
.then((server) => {
  const termSignals = ['SIGTERM','SIGINT'];
  termSignals.forEach(sig => process.on(sig, () => {
    console.log('Received', sig);
    return shutdown(server);
  }))
})
