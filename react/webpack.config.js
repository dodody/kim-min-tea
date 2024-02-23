const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', 
  entry: './src/app.js', 
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js'
  }, 
  devServer: {
    compress: true, 
    port: 9999, 
  }, 
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader', 
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"]
          }
        }
      }
    ]
  }, 
  plugins: [
    new HtmlWebpackPlugin({
      title: '2.2 객체 to DOM RENDER', 
      template: 'index.html', 
    })
  ], 
}