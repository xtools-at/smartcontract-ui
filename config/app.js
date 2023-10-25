module.exports = {
	// page
	name: "Smart Contract UI",
	title: "Smart Contract UI | Ethereum contract interaction tool",
	description:
		"Interact with any Ethereum/EVM smart contract with ease. Built for Beam network.",
	basePath: "/smartcontract-ui", // set to "" if not needed
	host: "https://xtools-at.github.io",
	corsProxyUrlPrefix: "https://corsproxy.io/?",
	creatorTwitter: "@xtools_",
	backgroundUrl: "",
	iframeUrl: "https://onbeam.com", // set to "" to use background image

	// chains
	defaultChainId: 4337,
	chainExplorerIframe: [
		4337, 13337, 82, 83, 338, 1001, 1313161554, 1313161555, 369, 943, 1088, 588,
		599, 19, 20, 21,
	],
	chainExplorerIframeBlacklist: [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 420, 11155111, 10200,
	],
	chainOrder: [
		// Beam
		4337, 13337,
		// Eth
		1, 5, 11155111,
		// AVAX
		43114, 43113,
		// Polygon
		137, 80001,
		// BSC
		56, 97,
		// FTM
		250, 4002,
		// Arb
		42161, 42170, 421613, 421614,
		// OP
		10, 420,
		// Base
		8453, 84531, 84532,
		// Linea
		59144, 59140,
		// zk sync
		280, 324,
		// Polygon ZK
		1101, 1442,
		// Gnosis
		100, 10200,
		// Flare
		14, 16, 114,
		// CRO
		25, 338,
		// Klaytn
		8217, 1001,
		// Moonbase, Moonriver
		1284, 1285, 1287,
		// Celo
		42220, 44787,
		// Aurora (NEAR)
		1313161554, 1313161555,
		// PulseChain
		369, 943,
		// OKX
		66, 65,
		// opBNB
		204, 5611,
		// Meter
		82, 83,
		// Metis
		1088, 588, 599,
	],
};
