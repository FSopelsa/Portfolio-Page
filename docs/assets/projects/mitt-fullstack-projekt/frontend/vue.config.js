const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  }
}) 