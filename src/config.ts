import * as Path from 'path';

export default {
  data_dir: process.env['DATA_DIR'] || Path.resolve(process.cwd(), 'data'),
}
