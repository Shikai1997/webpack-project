const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, "src"),
    entry: {
        index: "./js/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        assetModuleFilename: "[path][name].[ext]",
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: "vendor",
                    chunks: "initial",
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            // {
            //       test: /\.css$/i,
            //       use: [MiniCssExtractPlugin.loader, "css-loader"],
            //   },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(sass|scss)$/i,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                // test: /\.html$/,
                // use: [{
                //     loader: "file-loader",
                //     options: {
                //         name: "[path][name].[ext]",
                //     },
                // }, ],
            },
            {
                test: /\.(js)$/i,
                use: "babel-loader",
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                type: "asset/resource",
                use: [{
                    loader: "image-webpack-loader",
                    options: {
                        mozjpeg: {
                            progressive: true,
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.9],
                            speed: 4,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75,
                        },
                    },
                }, ],
            },
            // {
            //     test: /\.html$/i,
            //     loader: "html-loader",
            // },
        ],
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: "css/[name].css",
        // }),
        //  直接搬
        new CopyWebpackPlugin({ patterns: [{ from: "assets", to: "assets" }] }),
        new HtmlWebpackPlugin({
            title: "Webpack前端自動化開發",
            filename: "index.html",
            template: "template/template.html",
            chunjs: ["vendor", "index"],
        }),
    ],
    devServer: {
        compress: true,
        port: 3000,
    },
};