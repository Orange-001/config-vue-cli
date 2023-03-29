## @vue/cli 5.x的配置实践

##  一、介绍

### 1、基础内容

​	1）CLI 

​	CLI (@vue/cli) 是一个全局安装的 npm 包，提供了终端里的 vue 命令。例：vue create；vue ui

​	2）CLI 服务

​	CLI 服务 (`@vue/cli-service`) 是一个开发环境依赖。它是一个 npm 包，局部安装在每个 `@vue/cli` 创建的项目中。CLI 服务是构建于 [webpack](http://webpack.js.org/) 和 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 之上的。它包含了：

- 加载其它 CLI 插件的核心服务；

- 一个针对绝大部分应用优化过的内部的 webpack 配置；

- 项目内部的 `vue-cli-service` 命令，提供 `serve`、`build` 和 `inspect` 命令

  3）CLI 插件

  CLI 插件是向你的 Vue 项目提供可选功能的 npm 包。Vue CLI 插件的名字以 `@vue/cli-plugin-` (内建插件) 或 `vue-cli-plugin-` (社区插件) 开头。

### 2、初始配置

### 1）目录

![1679930857056](C:\Users\柯传佳\AppData\Roaming\Typora\typora-user-images\1679930857056.png)

2）package.json

```json
{
  "name": "config-vue-cli",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.8.3",
    "vue": "^3.2.13"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}

```

3）vue.config.js

```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
```

4）Babel.config.js

```
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

5）jsconfig.json

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "baseUrl": "./",
    "moduleResolution": "node",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  }
}
```

### 3、默认配置

1）默认使用babel、eslint

2）`cache-loader` 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 `node_modules/.cache [CLI 服务 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/cli-service.html#%E7%BC%93%E5%AD%98%E5%92%8C%E5%B9%B6%E8%A1%8C%E5%A4%84%E7%90%86)

3）`thread-loader` 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启

4）在安装之后，`@vue/cli-service` 也会安装 [yorkie](https://github.com/yyx990803/yorkie)，它会让你在 `package.json` 的 `gitHooks` 字段中方便地指定 Git hook  [CLI 服务 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/cli-service.html#git-hook)

5）默认将[`useBuiltIns: 'usage'`](https://new.babeljs.io/docs/en/next/babel-preset-env.html#usebuiltins-usage) 传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill。当使用 Vue CLI 来[构建一个库或是 Web Component](https://cli.vuejs.org/zh/guide/build-targets.html) 时，推荐给 `@vue/babel-preset-app` 传入 `useBuiltIns: false` 选项。这能够确保你的库或是组件不包含不必要的 polyfills。通常来说，打包 polyfills 应当是最终使用你的库的应用的责任。[浏览器兼容性 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/browser-compatibility.html#usebuiltins-usage)

6）默认引入 html-webpack-plugin。`public/index.html` 文件是一个会被 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 处理的模板。在构建过程中，资源链接会被自动注入。另外，Vue CLI 也会自动注入 resource hint (`preload/prefetch`、manifest 和图标链接 (当用到 PWA 插件时) 以及构建过程中处理的 JavaScript 和 CSS 文件的资源链接。[HTML 和静态资源 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/html-and-static-assets.html)

​	preload：一个 Vue CLI 应用会为所有初始化渲染需要的文件自动使用 preload

​	prefetch：一个 Vue CLI 应用会为所有作为 async chunk 生成的 JavaScript 文件 ([通过动态 `import()` 按需 code splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 的产物，即写路由时动态import组件) 自动使用prefetch

7）默认小于8KiB的图片资源会被内联，以减小HTTP请求的数量。（即Base64，带来的问题时文件变大）[HTML 和静态资源 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E4%BB%8E%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%AF%BC%E5%85%A5)

8）静态资源的处理

​	在js、css、template中通过相对路径引用，会被webpack处理

​	在public目录下(public目录下的资源只能通过绝对路径引用)，会被直接拷贝，不会经过webpack处理

​		[HTML 和静态资源 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#public-%E6%96%87%E4%BB%B6%E5%A4%B9)

​	[HTML 和静态资源 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E5%A4%84%E7%90%86%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90)

9）Vue CLI 项目天生支持 [PostCSS](http://postcss.org/)、[CSS Modules](https://github.com/css-modules/css-modules) 和包含 [Sass](https://sass-lang.com/)、[Less](http://lesscss.org/)、[Stylus](http://stylus-lang.com/) 在内的预处理器。

​	Vue CLI 内部使用了 PostCSS。可以通过 `.postcssrc`文件或`vue.config.js` 中的 					`css.loaderOptions.postcss` 配置 [postcss-loader](https://github.com/postcss/postcss-loader)

​	CSS Modules通常不需要使用，与scoped技术都是为了给css限定作用域

​	使用Sass、Less、Stylus预处理器需要安装loader

​	[CSS 相关 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/css.html#css-%E7%9B%B8%E5%85%B3)

10）配置webpack

​	configureWebpack(简单配置)

​		会被 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并入最终的 webpack 配置

​		通常用于引入一些plugin

​		有些 webpack 选项是基于 `vue.config.js` 中的值设置的，所以不能直接修改。如output.path和output.publicPath（应该修改vue.config.js中的outputDir和publicPath）

​	chainWebpack(链式配置)

​		Vue CLI 内部的 webpack 配置是通过 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 维护的

​		通常用于增加、修改、替换、删除loader；修改插件选项等

​		[Webpack-chain 从入门到深入 - 掘金 (juejin.cn)](https://juejin.cn/post/6947851867422621733)

11）模式和环境变量

​	当运行 `vue-cli-service` 命令时，所有的环境变量都从对应的[环境文件](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)中载入。共有development、test、production三种模式。[模式和环境变量 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

![1680095590880](C:\Users\柯传佳\AppData\Roaming\Typora\typora-user-images\1680095590880.png)

​	在代码中始终可用的环境变量

​		VUE_APP_开头的变量：可以在vue.config.js中被赋值

​		NODE_ENV：`"development"`、`"production"` 或 `"test"`，取决于模式。

​		BASE_URL：与vue.config.js中的publicPath相符。

​	注1：除以上三种变量在代码中可用，其余自定义的环境变量只在vue.config.js中能取到值，在别处为undefined

​	注2：环境变量不能在template中直接以process.env.*引用，必须赋值给data中的变量才能使用（插值语法不认识process）。

​	注3：只有以上三种环境变量可以在 `public/index.html` 中以 [HTML 插值](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E6%8F%92%E5%80%BC)中介绍的方式使用。

12）构建目标

​	应用：

​		![1680101089884](C:\Users\柯传佳\AppData\Roaming\Typora\typora-user-images\1680101089884.png)

​	库

​	web components组件

​	[构建目标 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/build-targets.html#%E6%9E%84%E5%BB%BA%E7%9B%AE%E6%A0%87)

13）history路由模式const Router = new VueRouter({mode: 'history'}...)

​	使用history模式，必须配置nginx，将没有匹配到静态文件的请求回退到index.html，否则访问页面会404。[部署 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/deployment.html#%E4%BD%BF%E7%94%A8-history-pushstate-%E7%9A%84%E8%B7%AF%E7%94%B1)

​	nginx配置见[不同的历史模式 | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/essentials/history-mode.html#nginx)

### 4、优化

1）现代模式 vue-cli-service build --modern [浏览器兼容性 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/browser-compatibility.html#%E7%8E%B0%E4%BB%A3%E6%A8%A1%E5%BC%8F)

2）图片资源是否转base64由8KIB的限制调整为4KIB，缩小文件体积[HTML 和静态资源 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E4%BB%8E%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84%E5%AF%BC%E5%85%A5)

3）审查webpack配置

​	[webpack 相关 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/webpack.html?#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE)

​	[CLI 服务 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-inspect)


