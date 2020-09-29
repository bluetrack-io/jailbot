import { Registry } from 'prom-client';
import * as Express from 'express';
import * as Querystring from 'querystring';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RawRecordProviderI } from './interfaces';

export default function ExpApp(sqliteFilepath:string, prom: Registry, rawRecords:RawRecordProviderI): Express.Application {
  const app = Express();

  app.get('/favicon.ico', ({}, res) => res.status(404).end());

  app.get('/metrics', ({}, res) => res.contentType('text/plain').send(prom.metrics()))

  app.get('/download-database', ({}, res) => {
    return res.download(sqliteFilepath, 'jailbot.sqlite');
  })

  app.get('/batch-list', async (req, res, next) => {
    const pageSize = 20;
    const queryPage = Number(req.query['page']);
    // listPage is the human-friendly (starts at 1) page number
    // If a non-number is provided, it will use 1. If a value <= 0 is provided, it will also use 1
    const listPage = isNaN(queryPage) ? 1 : ( queryPage > 0 ? queryPage : 1 );
    const batches = await rawRecords.getBatches(pageSize, ((listPage - 1) * pageSize));

    const bodyHtml = renderToStaticMarkup(
      <div>
        <a href={[req.path, Querystring.stringify({...req.query,page:listPage - 1})].join('?')}><button disabled={listPage==1}>Previous Page</button></a>
        <a href={[req.path, Querystring.stringify({...req.query,page:listPage + 1})].join('?')}><button disabled={batches.length < pageSize}>Next Page</button></a>
        <br/>
        <table>
          <thead>
            <tr><th>Batch Time</th></tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.batch_id}>
                <td><a href={`/batch/${b.batch_id}`}>{b.time.toLocaleString()}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    return res.send(bodyHtml);
  })
  
  app.get('/*', async (req, res, next) => {
    const batches = await rawRecords.getBatches(10);
    const mostRecentBatch = await rawRecords.getRecordsByBatch(batches[0].batch_id);
    const bodyHtml = renderToStaticMarkup(
      <div>
        Jailbot
        <hr/>
        Last updated: {mostRecentBatch[0].saved_at}
        <br/>
        Last inmate count: {mostRecentBatch.length}
      </div>
    )
    return res.send(bodyHtml);
  })

  return app;
}
