const path = require("path")
const gasWebpackPlugin = require("gas-webpack-plugin")

module.exports = {
    mode: 'production',
    entry: './src/Code.ts',
    output: {
      path: path.resolve(__dirname,'dist'),
      filename: 'Code.gs',
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader'
        }
      ]
    },
    plugins: [new gasWebpackPlugin()]
  }