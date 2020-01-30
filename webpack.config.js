const path = require("path")
module.exports = {
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
};