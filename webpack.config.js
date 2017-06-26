const path = require("path");
const webpack = require("webpack");


module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "static/js"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    }
}