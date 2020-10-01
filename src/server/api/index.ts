import { Router } from 'express';
import * as Knex from 'knex';
import { BatchMeta, BatchData, InmateRecord, SystemSummaryStats } from '../../shared';

export default function ApiRouter(knex:Knex){
  const api = Router();

  api.route('/batches')
    .get(async (req, res, next) => {
      const batches: BatchMeta[] = (await knex('batches').select({
        'id': 'id',
        'time': 'saved_at'
      }).orderBy('saved_at','desc'))
      // Convert from string to unix time
      .map(b => ({
        ...b,
        time: Math.round(new Date(b['time']).getTime() / 1000)
      }))
      return res.send(batches);
    })
  
  api.route('/batch/:batchId')
    .get(async (req, res, next) => {
      const batchId = req.params['batchId'];
      const batchRecords: InmateRecord[] = (await knex('raw_records')
        .select().where('batch_id', batchId))
        .map(raw => ({
          id: raw['id'],
          name: raw['name'],
          datetimebooked: raw['datetimebooked'],
          charges: raw['charges'],
          detainers: raw['detainers'],

          bookno: String(raw['bookno']),
          bookhandle: String(raw['bookhandle']),

          amount: String(raw['amount']),
          outstandingbonds: String(raw['outstandingbonds']),
          outstandingdetainers: String(raw['outstandingdetainers']),

          mugshot_id: raw['mugshotpath'],
        }))
      

      const batchData: BatchData = {
        id: batchId,
        time: Math.round(Date.now() / 1000),
        records: batchRecords
      }
      return res.send(batchData);
    })
  
  api.route('/stats')
    .get(async (req,res,next) => {
      const stats: SystemSummaryStats = {
        "Unique Mugshots": (Object.values(await knex('mugshot_hashes').first().count('hash'))[0] as number),
        "Unique Names": (await knex('raw_records').select('name').distinct('name')).length,
        "Unique Charges": (await(knex('raw_records').distinct('charges').orderBy('charges')))
        .map(d => d['charges'].trim())
        .filter(c => Boolean(c))
        .length
      }
      return res.send(stats)
    })

  return api;
}
