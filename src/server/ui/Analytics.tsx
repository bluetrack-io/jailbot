import * as React from 'react';

export type AckeeEmbedProps = {
  endpoint: string;
  domain_id: string;
};

export const AckeeEmbed: React.FunctionComponent<AckeeEmbedProps> = props => (
  props.endpoint && props.domain_id ? <script async src={[props.endpoint,'tracker.js'].join('/')} data-ackee-server={props.endpoint} data-ackee-domain-id={props.domain_id}></script> : null
)
