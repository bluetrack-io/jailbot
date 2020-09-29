import * as Knex from 'knex';
import { RawRecordProviderI } from '../interfaces';
import { BatchMetadata, RawInmateRecord, StoredInmateRecord } from '../types';
import { v4 as uuid4 } from 'uuid';
import { stringSha256Sum } from '../utils';
import * as Bluebird from 'bluebird';
import { off } from 'process';

export class KnexRawRecordProvider implements RawRecordProviderI {
  private readonly knex: Knex;
  private readonly table_name: string = 'raw_records';
  constructor(knex:Knex){
    this.knex = knex;
  }

  protected async saveRecord(record:RawInmateRecord, batch_id:string): Promise<void> {
    const mugshotData = {
      hash: stringSha256Sum(record.mugshotpath),
      data: record.mugshotpath
    }
    const recordData = {
      ...record,
      id: uuid4(),
      batch_id,
      mugshotpath: mugshotData.hash,
    }
    // Check if the mugshot already exists
    const mugshotSaved = Boolean((await this.knex('mugshot_hashes').select('hash').where('hash', mugshotData.hash)).length > 0)
    if(!mugshotSaved){
      // If it does not, save it
      await this.knex('mugshot_hashes').insert(mugshotData);
    }
    // Write the record data
    await this.knex(this.table_name).insert(recordData);
  }

  async saveRecords(records:RawInmateRecord[], batch_id:string){
    const batchSaved = Boolean((await this.knex('batches').select('id').where('id', batch_id)).length > 0)
    if(!batchSaved){
      await this.knex('batches').insert({
        id: batch_id,
      })
    }
    await Bluebird.mapSeries(records, r => this.saveRecord(r, batch_id))
  }
  
  async getRecordsByBatch(batch_id:string): Promise<StoredInmateRecord[]> {
    return this.knex(this.table_name)
      .select().where('batch_id', batch_id)
  }

  async getBatches(limit?:number, offset?:number): Promise<BatchMetadata[]> {
    const batchQuery = this.knex('batches').orderBy('saved_at','desc');
    if(limit){
      batchQuery.limit(limit);
    }
    if(offset){
      batchQuery.offset(offset);
    }
    const batches = await batchQuery;
    return batches.map(b => ({
      batch_id: b['id'],
      time: new Date(b['saved_at'])
    }))
  }
}
