const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//  根據pug內路徑 生成對應htmlPlugins
const setMPA = ()=>{
	const glob = require('glob');
	let htmlWebpackPlugins = [];
	glob.sync('./src/pug/*.pug').forEach(src => {
		const fullName = src.split('pug/')[1].split('.')[0]
		htmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				filename: `${fullName}.html`,
				template: path.join(__dirname, 'src/pug/'+fullName+'.pug'),
				chunjs: ["vendor", "index"],
			}),
		)
	});
	return htmlWebpackPlugins
}

const htmlWebpackPlugins = setMPA();

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
    target: ['web', 'es5'],
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
        ],
    },
    plugins: [
        //  直接搬
        new CopyWebpackPlugin({ patterns: [{ from: "assets", to: "assets" }] }),
        new HtmlWebpackPlugin({
            title: "Webpack前端自動化開發",
            filename: "index.html",
            template: "template/template.html",
            chunjs: ["vendor", "index"],
        }),
        // new HtmlWebpackPlugin({
        //     filename: "testpug.html",
        //     template: "pug/index.pug",
        //     chunjs: ["vendor", "index"],
        // }),
    ].concat(htmlWebpackPlugins),
    devServer: {
        compress: true,
        port: 3000,
    },
};