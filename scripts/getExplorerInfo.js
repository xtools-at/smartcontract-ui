const fs = require("fs");
const path = require("path");
const config = require("../config/app");
const fetch = require("node-fetch");

const priorityExplorers = [
	"etherscan",
	"otterscan",
	"dexguru",
	"blockscout",
	"scan",
];
const BATCH_SIZE = 25;
const BATCH_TIMEOUT = 4;

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
				chain.explorers &&
				chain.explorers.length &&
				chain.rpc &&
				chain.rpc.length > 0
			) {
				if (chain.title && chain.title.length < 50) chain.name = chain.title;

				rawChains.push(chain);
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
		`>> getIframeInfo: fetching ${chains.length}/${fileNames.length} explorer urls`
	);

	const explorers = {};
	const promises = [];

	for (let i = 0; i < chains.length; i++) {
		const chain = chains[i];
		if (chain && chain.explorers && chain.explorers.length) {
			for (let j = 0; j < chain.explorers.length; j++) {
				const explorer = chain.explorers[j];

				if (i > 0 && i % BATCH_SIZE === 0) {
					console.log(`> fetching ${i}/${chains.length}`);
					await new Promise((resolve) =>
						setTimeout(resolve, BATCH_TIMEOUT * 1000)
					);
				}

				promises.push(
					fetch(explorer.url, {
						timeout: 4 * 1000,
					})
						.then((res) => {
							if (
								!res.headers.raw()["x-frame-options"] &&
								!explorer.url.includes("?")
							) {
								chains[i].explorers[j].iframe = true;
							}

							if (!explorers[chain.chainId]) {
								explorers[chain.chainId] = [];
							}
							explorers[chain.chainId].push(chains[i].explorers[j]);

							console.log(
								"iframe:",
								!res.headers.raw()["x-frame-options"],
								chain.name,
								explorer.url
							);
						})
						.catch(() => {
							console.log("failed:", chain.name, explorer.url);
						})
				);
			}

			priorityExplorers.reverse().forEach((priority) => {
				chain.explorers = chain.explorers.sort((a, b) => {
					if (a.name.includes(priority)) {
						return -1;
					} else if (b.name.includes(priority)) {
						return 1;
					} else {
						return 0;
					}
				});
			});
		}
	}

	await Promise.allSettled(promises);

	fs.writeFileSync(
		__dirname + "/../config/explorers.json",
		JSON.stringify(explorers, null, 2)
	);
};

main();
