const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  /**
   * Type: boolean | Array<string | RegExp>
     Default: false
     默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
   */
  transpileDependencies: true,
  configureWebpack: config => {
    let plugins = []
    if (process.env.NODE_ENV === 'production') {//生产
      // plugins = [new MyAwesomeWebpackPlugin1()]
    } else {//开发
      // plugins = [new MyAwesomeWebpackPlugin2()]
    }
    return {
      plugins
    }
  },
  chainWebpack: config => {

    // 限制内联图片资源为4KIB
    const imageRule = config.module.rule('images')
    imageRule
      .set('parser', {
        dataUrlCondition: {
          maxSize: 4 * 1024
        }
      })

    // 修改loader选项
    const vueRule = config.module.rule('vue')
    vueRule
      .use('vue-loader')
      .tap(options => {
        return options
      })

    // 添加一个新的loader
    // const graphqlRule = config.module.rule('graphql')
    // graphqlRule
    //   .test(/\.graphql/)
    //   .use('graphql-tag/loader')
    //   .loader('graphql-tag/loader')
    //   .end()
    //   // 添加第二个loader
    //   .use('other-loade')
    //   .loader('other-loade')
    //   .end()

    // 替换一个规则里的loader
    // const svgRule = config.module.rule('svg')
    // svgRule
    //   // 清除已有的所有 loader。若不如此则接下来的 loader 会附加在该规则现有的 loader 之后
    //   .uses.clear()
    //   // 添加要替换的 loader
    //   .use('vue-svg-loader')
    //   .loader('vue-svg-loader')

    // 修改index.html默认路径
    // const htmlPlugin = config.plugin('html')
    // htmlPlugin
    //   .tap(args => {
    //     args[0].template = '/Users/username/proj/app/templates/index.html'
    //   })
  },
  css: {
    // 可以配置css-loader、postcss-loader、sass-loader、less-loader、stylus-loader选项
    loaderOptions: {
      css: {},
      sass: {},
      postcss: {}
    }
  }
})
