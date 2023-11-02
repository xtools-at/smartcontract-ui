const fs = require("fs");
const path = require("path");
const config = require("../config/app");
const fetch = require("node-fetch");

const BATCH_SIZE = 50;
const BATCH_TIMEOUT = 6;
const CALL_TIMEOUT = 14;

const main = async () => {
	const startTime = Date.now();
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
						method: "HEAD",
						timeout: CALL_TIMEOUT * 1000,
					})
						.then((res) => {
							const headers = res.headers.raw();
							let allowsIframes = true;

							if (headers["x-frame-options"] || headers["X-Frame-Options"]) {
								allowsIframes = false;
							}
							const csp =
								headers["content-security-policy"] ||
								headers["Content-Security-Policy"];
							if (csp && csp.length) {
								csp.forEach((p) => {
									if (p.includes("frame-ancestors")) allowsIframes = false;
								});
							}

							if (allowsIframes === true) {
								chains[i].explorers[j].iframe = true;
							}

							console.log("iframe:", allowsIframes, chain.name, explorer.url);
						})
						.catch(() => {
							chains[i].explorers[j].failed = true;
							console.log("failed:", chain.name, explorer.url);
						})
				);
			}
		}
	}

	await Promise.allSettled(promises);

	chains.forEach((chain) => {
		explorers[chain.chainId] = chain.explorers.filter((ex) => !ex.failed);
		if (!explorers[chain.chainId].length) explorers[chain.chainId] = undefined;
	});

	fs.writeFileSync(
		__dirname + "/../config/explorers.json",
		JSON.stringify(explorers, null, 2)
	);

	console.log(
		`\n>> Finished probing ${fileNames.length} explorer urls, time elapsed = ${
			(Date.now() - startTime) / 1000
		} seconds.`
	);
};

main();
