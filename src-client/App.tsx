import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Container, Row, Col } from 'reactstrap';
import { AppNav, BatchList, BatchView } from './ui';

export const App: React.FunctionComponent<{}> = () => {
  return (
    <Container>
      <Row>
        <Col>
          <AppNav items={[
            {label:'Batch List',href:'/batch-list'},
            {label:'Stats',href:'/stats'},
            {label:'Github',href:'http://github.com/bluetrack-io/jailbot'},
          ]}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <Switch>

            <Route path="/batch-list">
              <BatchList batches={[]}/>
            </Route>

            <Route path="/batch/:batchId">
              <BatchView batch={{}}/>
            </Route>

            <Route path="/stats">
              Stats page
            </Route>

            <Route exact path="/">
              Root page
            </Route>
            
            <Redirect to="/"/>
          </Switch>
        </Col>
      </Row>
    </Container>
  )
}

export default App;
