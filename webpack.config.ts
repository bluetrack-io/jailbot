import { Configuration } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as Path from 'path';

const SRC_DIR = Path.resolve(__dirname,'src/client');
const OUT_DIR = Path.resolve(__dirname,'dist/client');

export const config: Configuration = {
  mode: 'development',
  entry: [
    Path.resolve(SRC_DIR,'browser.tsx'),
  ],
  output: {
    path: OUT_DIR,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js','.jsx','.ts','.tsx'],
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{loader:'ts-loader'}],
      },
    ],
  },
  devServer: {
    contentBase: OUT_DIR,
    historyApiFallback: true,
    compress: true,
    port: 3000,
    proxy: {},
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Jailbot',
      hash: true,
      template: Path.resolve(SRC_DIR, 'template.html')
    }),
  ],
};

export default config;
