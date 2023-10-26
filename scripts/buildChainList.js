const fs = require("fs");
const path = require("path");
const config = require("../config/app");
const fetch = require("node-fetch");
const explorers = require("../config/explorers.json");

const main = async () => {
	const rawChains = [];
	const folderPath = path.resolve(
		__dirname,
		"../config/chainlist/_data/chains"
	);
	const fileNames = fs.readdirSync(folderPath);
	fileNames.forEach((fileName) => {
		try {
			const filePath = path.resolve(folderPath, fileName);
			const chain = JSON.parse(
				fs.readFileSync(filePath, { encoding: "utf-8" })
			);

			if (
				chain.status !== "deprecated" &&
				chain.status !== "incubating" &&
				chain.status !== "yolo" &&
				chain.rpc &&
				chain.rpc.length > 0 /* &&
				chain.chainId === chain.networkId */
			) {
				if (chain.title && chain.title.length < 50) chain.name = chain.title;
				chain.explorers = explorers[chain.chainId];

				if (chain.explorers && chain.explorers.length) {
					rawChains.push(chain);
				}
			}
		} catch (e) {}
	});

	const chains = [];
	const sortMap = {};
	rawChains
		.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
		.forEach((chain) => {
			if (config.chainOrder.includes(chain.chainId)) {
				sortMap[chain.chainId] = chain;
			} else {
				chains.push(chain);
			}
		});
	config.chainOrder.reverse().forEach((chainId) => {
		if (sortMap[chainId]) {
			chains.unshift(sortMap[chainId]);
		}
	});

	console.log(
		`>> buildChainList: building ${chains.length}/${fileNames.length} chainlist networks`
	);

	const {
		INFURA_API_KEY,
		ETHERSCAN_API_KEY,
		BSCSCAN_API_KEY,
		FTMSCAN_API_KEY,
		POLYGON_API_KEY,
		SNOWTRACE_API_KEY,
	} = require(__dirname + "/../config/keys.json");

	const NO_API_KEY = ETHERSCAN_API_KEY;

	const chainsAbiApi = {
		1: `result https://api.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		3: `result https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		4: `result https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		5: `result https://api-goerli.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		11155111: `result https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		10: `result https://api-optimistic.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		42: `result https://api-kovan.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${ETHERSCAN_API_KEY}`,
		56: `result https://api.bscscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${BSCSCAN_API_KEY}`,
		97: `result https://api-testnet.bscscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${BSCSCAN_API_KEY}`,
		128: `result https://api.hecoinfo.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${NO_API_KEY}`,
		137: `result https://api.polygonscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${POLYGON_API_KEY}`,
		70: `result https://api.hooscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${NO_API_KEY}`,
		250: `result https://api.ftmscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${FTMSCAN_API_KEY}`,
		321: `data.0.contract_abi https://explorer.kcc.io/v2api/contract/getabi?address={ADDRESS}`,
		4002: `result https://api-testnet.ftmscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${FTMSCAN_API_KEY}`,
		43113: `result https://api-testnet.snowtrace.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${SNOWTRACE_API_KEY}`,
		43114: `result https://api.snowtrace.io/api?module=contract&action=getabi&address={ADDRESS}&apikey=${SNOWTRACE_API_KEY}`,
		80001: `result https://api-mumbai.polygonscan.com/api?module=contract&action=getabi&address={ADDRESS}&apikey=${POLYGON_API_KEY}`,
	};

	chains.forEach((chain, index) => {
		const newChain = {
			name: chain.name,
			rpc: chain.rpc,
			faucets: chain.faucets,
			nativeCurrency: chain.nativeCurrency,
			chainId: chain.chainId,
			explorers: chain.explorers,
			abi: chain.abi,
			shortName: chain.shortName,
		};

		if (chainsAbiApi[chain.chainId] !== void 0) {
			newChain.abi = chainsAbiApi[chain.chainId].replace(
				"{ADDRESS}",
				"${ADDRESS}"
			);
		}

		chains[index] = newChain;
	});

	const rpcs = {};
	const chainIds = [];

	if (chainIds.length === 0) {
		for (let chain of chains) {
			if (chain.rpc[0]) {
				rpcs[chain.chainId] = chain.rpc[0].replace(
					"${INFURA_API_KEY}",
					INFURA_API_KEY
				);
				chainIds.push(chain.chainId);
			}
		}
	}

	fs.writeFileSync(
		__dirname + "/../config/chains.json",
		JSON.stringify(chains, null, 2)
	);
	fs.writeFileSync(
		__dirname + "/../config/chainIds.json",
		JSON.stringify(chainIds, null, 2)
	);
	fs.writeFileSync(
		__dirname + "/../config/rpcs.json",
		JSON.stringify(rpcs, null, 2)
	);
};

main();
