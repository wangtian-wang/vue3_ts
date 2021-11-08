const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    open: true,
  },
  transpileDependencies: true,
});
