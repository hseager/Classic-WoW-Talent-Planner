const path = require('path');

module.exports = {
  entry: './src/index.js',
  entry: './src/talent-data.json',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
};