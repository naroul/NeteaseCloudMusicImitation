const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',

  /**
   * 入口文件
   */
  entry: ['@babel/polyfill', './src/main.js'],

  /**
   * 出口文件
   */
  output: {
    /**
     * 打包文件出口路径
     */
    path: path.resolve(__dirname, 'dist'),
    /**
     * 打包出的文件名
     */
    filename: 'main.js',
    /**
     * 为项目中的所有资源指定一个基础路径
     * 不仅会影响虚拟目录的取值，
     * 还会影响利用html-webpack-plugin插件生成的index.html中引用的js、css、img等资源的引用路径
     * 在浏览器上运行时，dist中的所有文件都会在assets文件夹下
     */
    publicPath: '/assets/',
  },

  /**
   * 解析路径的设置
   */
  resolve: {
    /**
     * 给路径设置别名
     */
    alias: {
      /**
       * $ 表示精准匹配
       */
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './src/assets'),
      '^': path.resolve(__dirname, './src/util'),
    },

    /**
     * 导入时自动解析后缀
     */
    extensions: ['.js', '.vue', '.json', 'scss'],
  },

  /**
   * 处理JS、JSON以外类型的文件，并将它们转换为有效模块（支持import），并添加到依赖图中。
   */
  module: {
    rules: [
      {
        test: /\.css$/,
        /**
         * css-loader 解析css文件
         * style-loader 解析dom中<style></style>注入的样式
         * vue-style-loader 是Vue官方基于style-loader开发的适用vue的样式解析 依赖于style-loader
         * 用了vue-style-loader所以不需要再使用style-loader
         */
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        /**
         * 支持解析字体文件
         */
        test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        options: {
          /**
           * 设置打包后的图片在images文件夹下
           */
          name: 'images/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },

  /**
   * 插件，自定义webpack构建过程
   */
  plugins: [
    new VueLoaderPlugin(),
    /**
     * 因为在package.json中配置了 --hot 所以不用在这里显式地初始化该插件
     */
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
    }),
  ],

  devServer: {
    port: 0930,

    /**
     * 中间件，当404时重定向到默认的index.html（默认为主目录的index.html）
     */
    historyApiFallback: true,

    /**
     * 告诉服务器从哪里提供内容，即执行哪里的 index.html。（也就是服务器启动的根目录，默认为当前执行目录 __dirname)
     */
    contentBase: path.resolve(__dirname, 'dist'),

    /**
     * 热更新
     */
    hot: true,

    /**
     * 是否在浏览器中显示编译时的错误和警告
     */
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
