import * as React from 'react';

/**
 * Renders a box containing a formatted JSON string of the provided data
 */
export const JsonBox: React.FunctionComponent<{data:any}> = ({data}) => (
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>
)

export default JsonBox;
