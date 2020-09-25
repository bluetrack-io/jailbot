import * as Express from 'express';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RawRecordProviderI } from './interfaces';

export default function ExpApp(sqliteFilepath:string, rawRecords:RawRecordProviderI): Express.Application {
  const app = Express();

  app.get('/favicon.ico', ({}, res) => res.status(404).end());

  app.get('/download-database', ({}, res) => {
    return res.download(sqliteFilepath, 'jailbot.sqlite');
  })
  
  app.get('/*', async (req, res, next) => {
    const batches = await rawRecords.getBatches();
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
