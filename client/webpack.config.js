const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlTemplate = "./index.html";
const plugins = [new HtmlWebpackPlugin({template: htmlTemplate})];

module.exports = {
    
    // bundling mode
    mode: "production",

    // entry files
    entry: "./client.ts",

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "[name].js",
    },
    // file resolutions
    resolve: {
        extensions: [ ".ts", ".js" ],
    },
    plugins,
    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ]
    },
    optimization: {
        minimize: false
    }
};