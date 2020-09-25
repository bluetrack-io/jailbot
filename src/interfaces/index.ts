import { RawInmateRecord, StoredInmateRecord } from '../types';

export interface RawRecordProviderI {
  saveRecords(records:RawInmateRecord[], batch_id:string): Promise<void>;
  getRecordsByBatch(batch_id:string): Promise<StoredInmateRecord[]>;
  /**
   * Returns a list of objects containing information about batch groups
   * List will be sorted from newest to oldest
   */
  getBatches(): Promise<{batch_id:string}[]>
}
