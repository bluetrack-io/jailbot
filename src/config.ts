import * as Path from 'path';

export default {
  dev_mode: Boolean(process.env['NODE_ENV'] != 'production'),
  data_dir: process.env['DATA_DIR'] || Path.resolve(process.cwd(), 'data'),
  batch_interval_seconds: Number(process.env['BATCH_INTERVAL_SECONDS'] || 300), // Only respected if http.enabled == true
  http: {
    enabled: (process.env['HTTP_ENABLED'] || 'true').trim().toLowerCase() === 'true',
    port: Number(process.env['HTTP_PORT'] || 3000),
  },
}
