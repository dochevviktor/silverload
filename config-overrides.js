const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                "@primary-color": "#36393f", // customize as needed
                "@link-color": "#e6a07c", // customize as needed
            },
        },
    })
);