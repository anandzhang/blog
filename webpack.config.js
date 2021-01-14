const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    bundle: [
      './public/js/fix-footer.js',
      './public/js/mobile-bar.js',
    ],
    common: [
      './public/css/reset.css',
      './public/css/reuse.css',
      './public/css/common.css',
    ],
    index: './public/css/index.css',
    posts: './public/css/posts.css',
    archive: './public/css/archive.css',
    about: './public/css/about.css',
    markdown: [
      './public/lib/markdown.css',
      './public/lib/atom-one-light.css',
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  },
}
