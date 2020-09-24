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
