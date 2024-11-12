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
	iframeUrl: "https://docs.onbeam.com", // set to "" to use background image

	// chains
	defaultChainId: 4337,
	chainOrder: [
		// Beam
		4337, 13337,
		// Eth
		1, 11155111,
		// AVAX
		43114, 43113,
		// Sophon
		50104, 531050104,
		// Immutable zkEVM
		13371, 13473,
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
	],
};
