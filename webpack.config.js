const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = [{
    name: 'audio',
    entry: './src/audio/AudioManager.ts',
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'audioBundle.js',
        path: path.resolve(__dirname, 'static', 'js')
    }
},
{
    name: 'client',
    entry: './src/client/index.tsx',
    target: 'electron-renderer',
    module: {
        rules: [

        // we use babel-loader to load our jsx and tsx files
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader'
                },
            },

        // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: 'index.html'
        })
    ],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'client/bundle.js'
    }
},
{
    /* for webpack-dev-server */
    name: 'client-dev-web',
    entry: './src/client/index.tsx',
    target: 'electron-renderer',
    module: {
        rules: [

        // we use babel-loader to load our jsx and tsx files
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader'
                },
            },

        // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: 'index.html'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: 'client/bundle.js'
    },
    devServer: {
        /*contentBase: './static/client',*/
        port: 10080,
        hot: true
    }
}
]