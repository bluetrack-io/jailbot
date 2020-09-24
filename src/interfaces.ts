import { InmateRecord } from './types';

export interface InmateDatastoreI {
  saveRecord(record:InmateRecord): Promise<void>;
  getRecords(): Promise<InmateRecord[]>;
}
