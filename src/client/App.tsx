import * as React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { Container, Row, Col } from 'reactstrap';
import { AppNav, BatchList, BatchView } from './ui';
import { AxiosInstance } from 'axios';
import * as PathRegex from 'path-to-regexp';

export const App: React.FunctionComponent<{client:AxiosInstance}> = (props) => {
  const { client } = props;
  const withApiData = (apiRoute:string, Component:React.ComponentType<{data:any}>): any => {
    const urlCompiler = PathRegex.compile(apiRoute, {encode:encodeURIComponent});
    return withRouter(({match}) => {
      const [ data, setData ] = React.useState(null);
      if(data === null){
        client.get(urlCompiler(match.params)).then(r => setData(r.data));
        // Render loading content
        return null;
      }
      return <Component data={data}/>
    })
  }
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

            <Route path="/batch-list" component={withApiData('/v1/batches', BatchList)}/>

            <Route path="/batch/:batchId" component={withApiData('/v1/batch/:batchId', BatchView)}/>

            <Route path="/stats">
              This page is currently unavailable
            </Route>

            <Route exact path="/">
              This app scrapes the <a href="https://athena.dentonpolice.com/jailview/JailView.aspx">Denton PD Jail website</a> at
              regular intervals and stores the information for archival and analytical purposes.
              <br/><br/>
              Each time the site is scraped, a new "batch" is created. You can view all the batches by clicking "Batch List" at the top
              of this page.
              <hr/>
              This project is open-source. You are encouraged to contribute on <a href="http://github.com/bluetrack-io/jailbot">Github</a>!
            </Route>
            
            <Redirect to="/"/>
          </Switch>
        </Col>
      </Row>
    </Container>
  )
}

export default App;
