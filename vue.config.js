module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/css/abstracts/abstracts.scss";',
      },
    },
  },
  devServer: {
    https: true,
  },
};
