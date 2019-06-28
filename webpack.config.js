var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    // plugins: [
    //     new webpack.DefinePlugin({ //<--key to reduce React's size
    //         'process.env': {
    //             'NODE_ENV': JSON.stringify('production')
    //         }
    //     }),
    //     new webpack.optimize.AggressiveMergingPlugin(),
    //     new CompressionPlugin({
    //         filename: "[path].gz[query]",
    //         algorithm: "gzip",
    //         test: /\.js$|\.css$|\.html$/,
    //         threshold: 10240,
    //         minRatio: 0.8
    //     })
    // ],
};