(process.env as any)["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
import { getInmates } from './utils';
import { InmateDatastoreI } from './interfaces';
import { MemoryDatastore } from './entities';

async function main(datastore:InmateDatastoreI){
  const inmates = await getInmates();
  if(inmates.length == 0){
    console.log('No inmates found');
    return;
  }
  await datastore.saveRecord(inmates[0]);
  const storedRecords = await datastore.getRecords();
  const { mugshotpath, ...record } = storedRecords[0];
  console.log(record)
}

const memstore = new MemoryDatastore();
main(memstore)
