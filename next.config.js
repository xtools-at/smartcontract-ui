const config = require("./config/app");

module.exports = {
	reactStrictMode: true,
	assetPrefix: config.basePath ? `${config.basePath}/` : "",
	basePath: config.basePath,
};
