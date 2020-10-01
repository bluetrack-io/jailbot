import * as React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { SystemSummaryStats } from '../../shared';

export interface SystemStatsProps {
  data: SystemSummaryStats;
}

export const SystemStats: React.FunctionComponent<SystemStatsProps> = ({data}) => (
  <div>
    <Table striped bordered>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data).map(k => (
          <tr key={k}>
            <td>{k}</td>
            <td>{data[k]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)

export default SystemStats;
