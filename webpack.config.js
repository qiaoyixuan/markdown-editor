var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        bundle: [
            'webpack-dev-server/client?http://localhost',
            'webpack/hot/dev-server',
            './index.js',
        ]
    },
    output: {
        path: path.join(__dirname),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel?presets[]=stage-0&presets[]=es2015&presets[]=react&plugins[]=transform-object-assign']
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true,
      			"process.env": {
      				NODE_ENV: JSON.stringify("development")
      			}
        })
    ],
    devtool: 'eval-source-map'
};
