const path              = require('path');
const { isDevelopment } = require('./gulp_tasks/config');
const webpack           = require('webpack');

module.exports = {
    output  : {
        filename : 'main.js',
        path     : path.resolve(process.cwd(), "public")
    },
    watch   : isDevelopment,
    devtool : isDevelopment ? 'cheap-module-inline-source-map' : null,
    module  : {
        rules : [
            {
                test    : /\.js$/,
                exclude : [ /node_modules/ ],
                use     : [ {
                    loader  : 'babel-loader',
                    options : { presets : [ 'latest' ] }
                } ]
            }
        ]
    },
    plugins : [
        new webpack.ProvidePlugin({
            $               : 'jquery',
            jQuery          : 'jquery',
            'window.jQuery' : 'jquery',
            'window.$'      : 'jquery'
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
if ( !isDevelopment ) {
    module.exports.plugins.push(require('uglifyjs-webpack-plugin')());
}