const path = require('path')

module.exports = {
  "stories": [
    // "../src/**/*.stories.mdx",
    "../src/**/*.sb.@(js|jsx|ts|tsx)"
  ],
  // "addons": [
  //   "@storybook/addon-links",
  //   "@storybook/addon-essentials"
  // ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    
    }
  },
  webpackFinal: config => {

    // config.resolve.alias['i-render'] = path.resolve(__dirname, '../lib/src/index.js')
    config.resolve.alias['webpen'] = path.resolve(__dirname, '../src/index.ts')

    return config
  }
}