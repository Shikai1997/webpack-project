const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, "src"),
    entry: {
        index: "./js/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        assetModuleFilename: "[path][name][ext]",
        clean: true
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
        rules: [{
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(sass|scss)$/i,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
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
            {
                test: /\.pug$/,
                use: [{
                        loader: 'html-loader',
                        options: {
                            minimize: false
                                // 不壓縮 HTML
                        }
                    },
                    {
                        loader: 'pug-html-loader',
                        options: {
                            pretty: true
                                // 美化 HTML 的編排 (不壓縮HTML的一種)
                        }
                    },
                ]
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
        new HtmlWebpackPlugin({
            filename: "testpug.html",
            template: "pug/index.pug",
            chunjs: ["vendor", "index"],
        }),
        new HtmlWebpackPugPlugin({
            template: path.join(__dirname, 'src/pug/index.pug'),
            filename: 'test.html',
            inject: true,
            // 等於'body',javascript 資源將被放置到body元素的底部
            chunks: ['device', 'main'],
            // 指定需要引入的js，沒有設置默認全部引入
            excludeChunks: ['devor.js'],
            // 排除的js
            minify: {
                sortAttributes: true,
                collapseWhitespace: false,
                // 折疊空白字元就是壓縮Html
                collapseBooleanAttributes: true,
                // 折疊布林值属性，例:readonly checked
                removeComments: true,
                // 移除註釋
                removeAttributeQuotes: true
                    // 移除屬性的引號
            }
        }),
    ],
    devServer: {
        compress: true,
        port: 3000,
    },
};