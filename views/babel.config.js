module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: true } }]],
      plugins: [
        '@babel/plugin-transform-runtime',
        ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }],
      ],
    },
  },
};