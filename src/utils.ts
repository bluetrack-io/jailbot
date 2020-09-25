import Axios from 'axios';
import { RawInmateRecord } from './types';

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
