const { override, addLessLoader } = require('customize-cra');

// eslint-disable-next-line no-undef
module.exports = override(
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#36393f', // customize as needed
        '@link-color': '#e6a07c', // customize as needed
      },
    },
  })
);
