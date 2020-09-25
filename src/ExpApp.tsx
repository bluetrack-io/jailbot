import * as Express from 'express';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export default function ExpApp(): Express.Application {
  const app = Express();
  
  app.get('/*', (req, res, next) => {
    const bodyHtml = renderToStaticMarkup(
      <div>
        Jailbot
      </div>
    )
    return res.send(bodyHtml);
  })

  return app;
}
