module.exports = {
  mode: 'production',
  entry: './src/bundle.ts',
  output: {
    library: 'transitionController',
    filename: 'transition-controller.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  }
};
