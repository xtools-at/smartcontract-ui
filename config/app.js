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
	chainOrder: [
		4337, 13337, 1, 5, 11155111, 43114, 43113, 137, 80001, 56, 97, 250, 4002,
	],
	chainExplorerIframe: [4337, 13337, 82, 83],
};
