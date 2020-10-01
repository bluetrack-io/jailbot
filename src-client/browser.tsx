import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
  ,appTarget
)
