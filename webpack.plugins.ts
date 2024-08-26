import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyWebpackPlugin = require('copy-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyWebpackPlugin({
    patterns: [
        {
            from: path.resolve(__dirname, 'node_modules/transbank-pos-sdk/node_modules/@serialport/bindings-cpp/prebuilds'),
            to: path.resolve(__dirname, '.webpack/prebuilds'),
        },
    ],
  }),
];
