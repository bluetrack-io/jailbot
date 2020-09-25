import { RawInmateRecord } from '../types';

export interface RawRecordProviderI {
  saveRecords(records:RawInmateRecord[], batch_id:string): Promise<void>;
  getRecordsByBatch(batch_id:string): Promise<RawInmateRecord[]>;
  getBatches(): Promise<{batch_id:string}[]>
}
