import * as React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { BatchMeta } from '../../shared';

export interface BatchListProps {
  data: BatchMeta[];
}

export const BatchList: React.FunctionComponent<BatchListProps> = ({data}) => (
  <div>
    <Table striped bordered responsive>
      <thead>
        <tr><th>Batch Time</th></tr>
      </thead>
      <tbody>
        {data.map(b => (
          <tr key={b.id}>
            <td><Link to={`/batch/${b.id}`}>{new Date(b.time * 1000).toLocaleString()}</Link></td>
          </tr>
        ))}
        { data.length > 0 ? null : (
          <div>No records found</div>
        ) }
      </tbody>
    </Table>
  </div>
)

export default BatchList;
