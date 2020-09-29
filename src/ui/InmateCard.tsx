import * as React from 'react';
import { Col, Row, Card, CardBody, CardText, CardTitle, CardSubtitle } from 'reactstrap';
import { StoredInmateRecord } from '../types';

export interface InmateCardProps {
  record: StoredInmateRecord;
}

export const InmateCard: React.FunctionComponent<InmateCardProps> = props => {
  const r = props.record;
  /** K/V map to generate list items where key is the record property and value is the label */
  const listProps = {
    'amount': 'Bond Total',
    'charges': 'Charges',
  };
  return (
    <Card>
      <CardBody>
        <CardTitle>{r.name}</CardTitle>
        <CardSubtitle>Booked @ {r.datetimebooked}</CardSubtitle>
        <CardText>
          <Row>
            <Col style={{display:'none'}} xs={12} sm={2}>
              <img src="#"/>
            </Col>
            <Col xs={12} sm={10}>
              <ul>
                {Object.keys(listProps).map(p => (
                  <li key={p}><b>{listProps[p]}:</b>{' '}{r[p]}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </CardText>
      </CardBody>
    </Card>
  )
}

export default InmateCard;
