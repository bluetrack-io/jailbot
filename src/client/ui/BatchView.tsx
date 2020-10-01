import * as React from 'react';
import { Row, Col } from 'reactstrap';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { BatchData } from '../../shared';

export interface BatchViewProps {
  data: BatchData;
}

export const BatchView: React.FunctionComponent<BatchViewProps> = ({data}) => {
  /** K/V map to generate list items where key is the record property and value is the label */
  const listProps = {
    'amount': 'Bond Total',
    'charges': 'Charges',
  };
  return (
    <div>
      <Col xs={12}>Inmates Booked: {data.records.length}</Col>
      {data.records.map(r => (
        <Col key={r.id} xs={12}>
          <Card>
            <CardBody>
              <CardTitle style={{fontWeight:'bold'}}>{r.name}</CardTitle>
              <CardSubtitle>Booked @ <span style={{fontStyle:'italic'}}>{r.datetimebooked}</span></CardSubtitle>
              <Row>
                <Col xs={12} sm={2}>
                  <img style={{maxWidth:'100%'}} src={`/mugshot/${r.mugshot_id}`} alt="Mugshot"/>
                </Col>
                <Col xs={12} sm={10}>
                  <ul>
                    {Object.keys(listProps).map(p => (
                      <li key={p}><b>{listProps[p]}:</b>{' '}{r[p]}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      ))}
    </div>
  )
}

export default BatchView;
