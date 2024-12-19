const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

import path from 'path';
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';


export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure'
  }),
  new CopyWebpackPlugin({
    patterns: [
        {
            from: path.resolve(__dirname, 'node_modules/@serialport/bindings-cpp/prebuilds'),
            to: path.resolve(__dirname, '.webpack/prebuilds')
        },
        { from: 'src/assets', to: 'assets' }
    ]
  })
];
