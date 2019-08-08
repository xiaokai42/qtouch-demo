var path = require("path");

var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var CompressionWebpackPlugin = require("compression-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HappyPack = require("happypack");
var os = require("os");
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

console.log("NODE_ENV: " + process.env.NODE_ENV);
var debug = process.env.NODE_ENV !== "production";
// var target = process.env.npm_lifecycle_event;
// var API_URL = process.env.VUE_APP_API_URL;

const localPath = "http://127.0.0.1:8080"; // 本机地址
const netPath = "http://192.168.1.148:8081"; // server地址 "http://172.30.41.136:8081";

var serverPath = netPath;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: true,
  pages: undefined,
  filenameHashing: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 80,
    https: false,
    hotOnly: true,
    proxy: {
      "/api/": {
        target: serverPath,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      },
      "/admin/": {
        target: serverPath,
        changeOrigin: true,
        pathRewrite: {
          "^/admin": "/admin"
        }
      }
    }
  },
  configureWebpack: function(config) {
    const externals = {
      /* vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      echarts: "echarts",
      moment: "moment",
      iview: "iview" */
    };
    var happyPack = new HappyPack({
      id: "babel",
      loaders: ["babel-loader?cacheDirectory=true", "vue-loader"],
      threadPool: happyThreadPool,
      verboseWhenProfiling: true
    });
    var copyWebpackPlugin = new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./src/assets"),
        to: path.resolve(__dirname, `${config.output.path}/static`),
        ignore: [".*"]
      }
    ]);
    var plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      }),
      new CompressionWebpackPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      })
    ];
    if (process.env.NODE_ENV !== "development") {
      config.plugins = [...config.plugins, ...plugins];
      config.externals = externals;
    } else {
      config.plugins.push(happyPack);
      config.plugins.push(copyWebpackPlugin);
    }
  },
  chainWebpack: function(config) {
    config.resolve.alias
      .set("layout", resolve("src/layout"))
      .set("assets", resolve("src/assets"))
      .set("views", resolve("src/views"))
      .set("style", resolve("src/style"));

    /* config.plugin("html").tap(args => {
      const cdn = {
        // 开发环境
        dev: {
          css: ["https://unpkg.com/iview/dist/styles/iview.css"],
          js: ["https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"]
        },
        // 生产环境
        build: {
          css: ["https://unpkg.com/iview/dist/styles/iview.css"],
          js: [
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js",
            "https://cdn.bootcss.com/vue/2.5.17/vue.min.js",
            "https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js",
            "https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js",
            "https://cdn.bootcss.com/axios/0.18.0/axios.min.js",
            "https://unpkg.com/iview/dist/iview.min.js",
            "https://cdn.bootcss.com/echarts/4.2.0-rc.1/echarts.min.js"
          ]
        }
      };
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === "development") {
        args[0].cdn = cdn.dev;
      }
      return args;
    }); */
  }
};
