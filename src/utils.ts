import Axios from 'axios';
import { v4 as uuid4 } from 'uuid';
import { RawInmateRecord } from './types';
import { RawRecordProviderI } from './interfaces';

const jailClient = Axios.create({
  baseURL: 'https://athena.dentonpolice.com/jailview/JailView.aspx'
});

export const getInmates = (body:any={}): Promise<RawInmateRecord[]> => {
  return jailClient.post('/GetInmates', body)
  .then(r => {
    const jsonString = r.data['d'];
    if(!jsonString){
      throw new Error('Unexpected result fetching inmate records');
    }
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    }
    catch(err){
      console.error('Error parsing inmate results')
      throw err;
    }
  })
}

/**
 * Fetches the current list of inmates and saves their raw records
 * Returns the batch_id that was ran
 */
export const saveCurrentInmateRecords = async (recordProvider:RawRecordProviderI): Promise<string> => {
  const batchId = uuid4();
  const records = await getInmates();
  await recordProvider.saveRecords(records, batchId);
  return batchId;
}
