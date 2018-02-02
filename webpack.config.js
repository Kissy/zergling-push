let path = require('path');
let webpack = require('webpack');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Phaser webpack config
let phaserModule = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(phaserModule, 'src/phaser.js');

let definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'src/main/js/app.js')],
        vendors: ['phaser']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'target/dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    watch: true,
    plugins: [
        definePlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors'/* chunkName= */,
            filename: 'vendors.bundle.js'/* filename= */
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            proxy: {
                target: "http://localhost:8080",
                ws: true
            },
            serveStatic: [{
                route: ['/dist'],
                dir: 'target/dist'
            }]
        }),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ],
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: [ /\.vert$/, /\.frag$/ ], use: 'raw-loader'}
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser
        }
    }
};
