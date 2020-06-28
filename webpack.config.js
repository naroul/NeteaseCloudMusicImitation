const path = require('path');
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
    },

    /**
     * 导入时自动解析后缀
     */
    extensions: ['.js', '.vue', '.json'],
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
        test: /\.(png|jpg|gif|svg)$/,
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
  plugins: [new VueLoaderPlugin()],

  devServer: {
    port: 1009,

    /**
     * 中间件，当404时重定向到默认的index.html（默认为主目录的index.html）
     */
    historyApiFallback: true,

    /**
     * 是否在浏览器中显示编译时的错误和警告
     */
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
