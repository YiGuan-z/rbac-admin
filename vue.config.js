'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 页面标题配置
const name = defaultSettings.title || 'Vue Wolfcode Template'

// 项目端口配置, 可以通过环境配置文件中增加 port=xxx 来配置
const port = process.env.port || process.env.npm_config_port || 9528

// vue 项目完整配置 https://cli.vuejs.org/config/
module.exports = {
  /**
   * 公共资源访问基础路径
   */
  publicPath: '/',
  /* 项目编译后输出目录, 类似 java 的 target */
  outputDir: 'dist',
  /* 项目中动态引用的静态资源编译后的目录名称 */
  assetsDir: 'static',
  // 关闭 eslint 告警与错误消息
  lintOnSave: false,
  productionSourceMap: false,
  /* 开发服务器与请求后端 api 的配置 */
  devServer: {
    /* 项目启动端口 */
    port: port,
    /* 启动后自动开启浏览器 */
    open: true,
    /* eslint 相关配置 */
    overlay: {
      // 关闭 eslint 告警与错误消息
      warnings: false,
      errors: false
    },
    /* 后端 API 代理配置, 将符合规则的请求转发到后台 */
    proxy: {
      // 以指定的前缀开始应用代理
      [process.env.VUE_APP_BASE_API]: {
        // 代理后的目标服务器地址(后台服务器地址)
        target: 'http://localhost:8080',
        // 是否允许跨域
        changeOrigin: true,
        // 路径重写: 转发请求时将指定前缀的请求替换为指定字符串
        pathRewrite: {
          // 将当前环境的基础 api 替换为空字符串
          // 栗子: 当前为测试环境, 那么基础 url 为 /dev-api
          //      发起请求完整路径: http://localhost:9528/dev-api/users/changeStatus
          //      转发后的完整路径: http://localhost:8080/users/changeStatus
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    /* 前端模拟 api 接口服务, 在没有后端 api 时使用 */
    after: require('./mock/mock-server.js'),
    disableHostCheck: true
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
