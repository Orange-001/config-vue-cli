const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  publicPath: '/', // 默认'/',可以设置为''或'./'，这样所有资源会被链接为相对路径，打出来的包可以部署在任意路径(hisotry.pushState以及pages多页下不能使用)
  outDir: 'dist', // 默认值'dist'，输出目录(自动clean上次构建内容)
  assetsDir: '', // 放置生成的静态资源的(相对于outputDir的)目录，覆写filename或chunkFilename时该配置会被忽略
  indexPath: 'index.html', // 默认值'index.html'，相对outputDir的输出路径，也可以是绝对路径
  // filenameHashing: false, //默认值true，静态资源文件名默认包含hash以便更好控制缓存，设置为false可以关闭文件hash名
  // pages: { //配置多页应用
  //   index: {
  //     // page 的入口
  //     entry: 'src/index/main.js',
  //     // 模板来源
  //     template: 'public/index.html',
  //     // 在 dist/index.html 的输出
  //     filename: 'index.html',
  //     // 当使用 title 选项时，
  //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: 'Index Page',
  //     // 在这个页面中包含的块，默认情况下会包含
  //     // 提取出来的通用 chunk 和 vendor chunk。
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   // 当使用只有入口的字符串格式时，
  //   // 模板会被推导为 `public/subpage.html`
  //   // 并且如果找不到的话，就回退到 `public/index.html`。
  //   // 输出文件名会被推导为 `subpage.html`。
  //   subpage: 'src/subpage/main.js'
  // },
  // lintOnSave: 'default', // 默认值'default'，开发环境下通过eslint-loader在每次保存时lint代码，必须安装@vue/cli-plugin-eslint
  // runtimeCompiler: false, //默认值false，设置为true则使用包含运行时编译器的vue构建版本，可以再vue组件中使用template，但是应用会额外增加10kb左右
  /**
  * Type: boolean | Array<string | RegExp>
    Default: false
    默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
    对所有的依赖都进行转译可能会降低构建速度。如果对构建性能有所顾虑，你可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可。
    */
  transpileDependencies: true,
  productionSourceMap: false, // 默认值true，设置为false关闭生成环境sourcemap
  // crossorigin: undefined, //默认值undefined，设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
  // integrity: false, //默认值false，设置为true在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  // object/function，返回一个要被合并的配置，也可以不返回直接修改
  configureWebpack: config => {
    const plugins = [];
    if (process.env.NODE_ENV === 'production') { // 生产
      // plugins = [new MyAwesomeWebpackPlugin1()]
    } else { // 开发
      // plugins = [new MyAwesomeWebpackPlugin2()]
    }
    return {
      plugins
    };
  },
  chainWebpack: config => {
    // 限制内联图片资源为4KIB
    const imageRule = config.module.rule('images');
    imageRule
      .set('parser', {
        dataUrlCondition: {
          maxSize: 4 * 1024
        }
      });

    // 修改loader选项
    const vueRule = config.module.rule('vue');
    vueRule
      .use('vue-loader')
      .tap(options => {
        return options;
      });

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
    // requireModuleExtension: true, //默认值true，在js中import css|less|sass|scss|styl不用以.module.(css|less|sass|scss|styl) 结尾
    // extract: true, //默认值生产环境下是 true，开发环境下是 false，是否提取组件中的CSS至独立的CSS文件
    // 可以配置css-loader、postcss-loader、sass-loader、less-loader、stylus-loader选项
    // sourceMap: false, //默认值false，是否为CSS开启sourcemap，开启会影响构建性能
    loaderOptions: {
      css: {},
      sass: {},
      postcss: {}
    }
  },
  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    // 代理
    // proxy: {
    //   '/api': {
    //     target: '<url>',
    //     ws: true,
    //     changeOrigin: true
    //   },
    // }
  },
  // parallel: require('os').cpus().length > 1, //默认值，多核CPU系统构建时自动为babel、ts启用thread-loader
  // pwa: {}, //向pwa插件传递选项
  pluginOptions: {
    // foo: {
    //   // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
    // }
  }
});
