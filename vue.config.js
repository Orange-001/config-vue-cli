const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  /**
   * Type: boolean | Array<string | RegExp>
     Default: false
     默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
   */
  transpileDependencies: true
})
