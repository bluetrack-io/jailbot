import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';

export const App: React.FunctionComponent<{}> = () => {
  return (
    <Switch>

      <Route path="/batch-list">
        Batch list
      </Route>

      <Route path="/batch/:batchId">
        Batch view
      </Route>

      <Route path="/stats">
        Stats page
      </Route>

      <Route exact path="/">
        Root page
      </Route>
      
      <Redirect to="/"/>
    </Switch>
  )
}

export default App;
