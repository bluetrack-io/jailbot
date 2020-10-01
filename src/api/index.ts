import { Router } from 'express';

export default function ApiRouter(){
  const api = Router();

  api.route('/batches')
    .get((req, res, next) => {
      return res.send([]);
    })
  
  api.route('/batch/:batchId')
    .get((req, res, next) => {
      return res.status(404).end();
    })

  return api;
}
