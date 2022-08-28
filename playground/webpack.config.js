const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * @type {import('webpack').Configuration}
 */
exports.default = {
  // 'none' 模式打包后的代码更加可读
  // 默认情况下 webpack 在 development 模式下会将模块打包成字符串用 eval 执行
  // eval 执行的意义在于如果代码有报错，报错将会被 “延迟到运行模块时” 抛出
  // 'none' 模式打包的代码如果有报错，整个页面将会白屏
  mode: 'none',
  entry: {
    main: path.join(__dirname, 'src/main.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@babel/plugin-transform-typescript', { isTSX: true }],
              [require('../dist/babel'), { /* TODO: */specifier: args => args, }],
            ],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
  ],
}
