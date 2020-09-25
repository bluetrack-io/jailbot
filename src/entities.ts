import * as Knex from 'knex';
import { v4 as uuid4 } from 'uuid';
import { InmateDatastoreI } from './interfaces';
import { InmateRecord } from './types';

/** An in-memory (non-persistent) datastore provider */
export class MemoryDatastore implements InmateDatastoreI {
  private readonly recordList: InmateRecord[];
  constructor(){
    this.recordList = [];
  }
  async saveRecord(record:InmateRecord){
    this.recordList.push(record);
  }

  async getRecords(){
    return this.recordList;
  }
}

/** Datastore provider that utilizes knex for a backend */
export class KnexDatastore implements InmateDatastoreI {
  private readonly knex: Knex;
  private readonly runtime_batch: string;
  constructor(knex:Knex){
    this.knex = knex;
    this.runtime_batch = uuid4();
  }

  async saveRecord(record:InmateRecord){
    await this.knex('raw_records').insert({...record, runtime_batch: this.runtime_batch});
  }

  async getRecords(){
    return this.knex('raw_records').select();
  }
}
