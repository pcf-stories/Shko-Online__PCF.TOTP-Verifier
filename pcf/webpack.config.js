const webpack = require('webpack');
/**
 * This works if you have at least one commit in your git repository 
 */
const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim();
/**
 * This is the public endpoint of your sourcemap repository 
 */
const sourcemapRepository = 'https://sourcemaps.xrm.al/PCF/TOTPVerifier/';

module.exports = {
  devtool: false,
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      /* This instructs your bundle.js to read the correct revision sourcemaps from the repository */
      append: `\n//# sourceMappingURL=${sourcemapRepository}${revision}/[url]`,
      filename: '[name].map',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer/', 'Buffer']
    }),
  ]
};
