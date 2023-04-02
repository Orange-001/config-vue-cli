const { defineConfig } = require('@vue/cli-service');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 测量构建速度
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化查看构建后各个文件大小
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // 压缩图片
module.exports = defineConfig({
  outputDir: 'dist',
  assetsDir: '',
  transpileDependencies: true,
  productionSourceMap: false, // 默认值true，设置为false关闭生成环境sourcemap
  configureWebpack: config => {
    // 缓存生成的 webpack 模块和 chunk，来改善构建速度
    config.cache = {
      type: 'filesystem',
      allowCollectingMemory: true
    };

    const plugins = [];
    if (process.env.NODE_ENV === 'production') { // 生产
      config.plugins.push(
        // new SpeedMeasurePlugin(),
        // new BundleAnalyzerPlugin()
      );
    } else { // 开发
      // plugins = [new MyAwesomeWebpackPlugin2()]
    }
    return {
      plugins
    };
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') { // 生产
      // 限制内联图片资源为4KIB
      const imageRule = config.module.rule('images');
      imageRule
        .set('parser', {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        });
      const optimization = config.optimization;
      // 删除console、debugger、注释
      const terser = optimization.minimizer('terser');
      terser.tap(args => {
        const { terserOptions } = args[0];
        Object.assign(
          terserOptions,
          {
            compress: {
              ...terserOptions.compress,
              drop_console: true,
              drop_debugger: true
            },
            format: {
              comments: /@license/i
            }
          }
        );
        return args;
      });
      // 压缩图片
      const imageMinizer = optimization.minimizer('image-minizer');
      imageMinizer.use(ImageMinimizerPlugin, [{
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" }
                              ]
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      }]);
    } else { // 开发

    }
  },
  css: {
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
  pluginOptions: {
  }
});
