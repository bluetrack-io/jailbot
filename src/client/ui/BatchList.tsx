import * as React from 'react';
import { Link } from 'react-router-dom';
import { BatchMeta } from '../interfaces';

export interface BatchListProps {
  batches: BatchMeta[];
}

export const BatchList: React.FunctionComponent<BatchListProps> = ({batches}) => (
  <div>
    <ul>
      {batches.map(b => (
        <li key={b.batch_id}>
          <Link to={`/batch/${b.batch_id}`}>{b.time.toLocaleString()}</Link>
        </li>
      ))}
    </ul>
  </div>
)

export default BatchList;
