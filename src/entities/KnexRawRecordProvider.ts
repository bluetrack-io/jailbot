import * as Knex from 'knex';
import { RawRecordProviderI } from '../interfaces';
import { RawInmateRecord, StoredInmateRecord } from '../types';

export class KnexRawRecordProvider implements RawRecordProviderI {
  private readonly knex: Knex;
  private readonly table_name: string = 'raw_records';
  constructor(knex:Knex){
    this.knex = knex;
  }

  async saveRecords(records:RawInmateRecord[], batch_id:string){
    const data = records.map(r => ({...r, runtime_batch: batch_id}));
    await this.knex(this.table_name).insert(data);
  }
  
  async getRecordsByBatch(batch_id:string){
    return this.knex(this.table_name)
      .select().where('runtime_batch', batch_id)
  }

  async getBatches(){
    const batches = await this.knex(this.table_name).distinct('runtime_batch')
      .orderBy('saved_at','desc')
    return batches.map(b => ({
      batch_id: b['runtime_batch']
    }))
  }
}
