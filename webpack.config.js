const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: {
    common: './minify/common.js',
    index: './minify/index.js',
    posts: './minify/posts.js',
    archive: './minify/archive.js',
    about: './minify/about.js',
    markdown: './minify/markdown.js'
  },
  output: {
    filename: '[name].needless.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin()
    ]
  }
}
