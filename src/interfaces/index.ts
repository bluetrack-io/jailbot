import { RawInmateRecord } from '../types';

export interface InmateDatastoreI {
  saveRecord(record:RawInmateRecord): Promise<void>;
  getRecords(): Promise<RawInmateRecord[]>;
}
