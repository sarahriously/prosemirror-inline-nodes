const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: "prosemirror-inline-nodes",
    libraryTarget: "commonjs",
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 4000,
    devMiddleware: {
      index: true,
      writeToDisk: true,
    }
  },
  externals: {
    "prosemirror-view": "prosemirror-view",
    "prosemirror-state": "prosemirror-state",
    "prosemirror-model": "prosemirror-model",
    "prosemirror-transform": "prosemirror-transform",
  }
};