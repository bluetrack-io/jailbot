import * as React from 'react';

export interface BatchViewProps {
  batch: any;
}

export const BatchView: React.FunctionComponent<BatchViewProps> = ({batch}) => (
  <div>
    Batch View!
  </div>
)

export default BatchView;
