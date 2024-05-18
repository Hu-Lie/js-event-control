// rollup.config.js
import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
export default {
  input: "./src/index.js", // 入口文件
  output: [
    {
      file: "./dist/index.js",
      format: "umd",
      name: "EventControl",
    },
    {
      file: "./dist/index-es.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "./dist/index-cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  ],
  watch: {
    // 配置监听处理
    exclude: "node_modules/**",
  },
  plugins: [
    // 使用插件 @rollup/plugin-babel
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    serve({
      contentBase: "dist", //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
      port: 8080, //端口号，默认10001
    }),
    livereload("dist"), //watch dist目录，当目录中的文件发生变化时，刷新页面
  ],
};
