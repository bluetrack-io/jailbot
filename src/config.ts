import * as Path from 'path';

export default {
  data_dir: process.env['DATA_DIR'] || Path.resolve(process.cwd(), 'data'),
  http: {
    enabled: (process.env['HTTP_ENABLED'] || 'true').trim().toLowerCase() === 'true',
    port: Number(process.env['HTTP_PORT']) || 3000,
  },
}
