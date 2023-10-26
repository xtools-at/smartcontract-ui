const config = require("./config/app");
const chains = require("./config/chains.json");

module.exports = {
	reactStrictMode: true,
	assetPrefix: config.basePath ? `${config.basePath}/` : "",
	basePath: config.basePath || "/",
	async redirects() {
		const byChainId = chains.map((chain) => {
			return {
				source: `/${chain.chainId}`,
				destination: `/?network=${chain.chainId}`,
				permanent: true,
			};
		});
		const byName = chains.map((chain) => {
			return {
				source: `/${chain.name.toLowerCase().replace(" ", "-")}`,
				destination: `/?network=${chain.chainId}`,
				permanent: true,
			};
		});

		const byShortName = chains
			.filter((chain) => !!chain.shortName)
			.map((chain) => {
				return {
					source: `/${chain.shortName.toLowerCase().replace(" ", "-")}`,
					destination: `/?network=${chain.chainId}`,
					permanent: true,
				};
			});

		return [...byChainId, ...byName, ...byShortName];
	},
};
