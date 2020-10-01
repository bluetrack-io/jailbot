import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, withRouter } from 'react-router-dom';
import App from './App';
import { ApiClientI } from './interfaces';
import { v4 as uuid4 } from 'uuid';
import Axios from 'axios';

const client = Axios.create({
  baseURL: '/api'
})

window['getStuff'] = async () => {
  return client.get('/v1/batches').then(r=>r.data)
}

const mockBatches = new Array(10).fill(null)
  .map(() => ({
    batch_id: uuid4(),
    time: new Date()
  }))

const mockApiClient: ApiClientI = {
  getBatchList: async () => {
    return mockBatches;
  },
  getBatch: async (batch_id:string) => {
    return {}
  }
}

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

render(
  <BrowserRouter>
    <App client={client}/>
  </BrowserRouter>
  ,appTarget
)
