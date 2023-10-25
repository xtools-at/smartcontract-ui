import { useState } from "react";
import {
	iframeUrl as baseIframeUrl,
	chainExplorerIframe,
	chainExplorerIframeBlacklist,
} from "config/app";
import { Chain } from "types/Chain";

export const useIframeUrl = () => {
	const [iframeUrl, setIframeUrl] = useState(baseIframeUrl || "");

	const reset = () => {
		if (baseIframeUrl && iframeUrl !== baseIframeUrl) {
			setIframeUrl(baseIframeUrl);
		}
	};

	const updateIframeUrl = (
		chain: Chain | null | undefined,
		address: string | null | undefined,
		txHash: string | null | undefined
	) => {
		if (baseIframeUrl && chain?.explorers?.length) {
			// blacklist
			if (chainExplorerIframeBlacklist.includes(chain.chainId)) {
				reset();
				return;
			}

			// find working explorer
			let skip = !chainExplorerIframe.includes(chain.chainId);
			let explorer = chain.explorers[0];
			if (skip) {
				chain.explorers.forEach((exp) => {
					const loName = exp.name?.toLowerCase();
					if (
						loName &&
						(loName.includes("dexguru") ||
							loName.includes("blockscout") ||
							loName.includes("subscan"))
					) {
						explorer = exp;
						skip = false;
					}
				});
			}

			// skip if not working
			if (skip) {
				reset();
				return;
			}

			let url = `${explorer.url}${txHash ? `/tx/${txHash}` : ""}`;
			if (url.endsWith("/")) url = url.substring(0, url.length - 1);

			if (address && !txHash) {
				url = `${url}/address/${address}`;
			} else if (txHash) {
				url = `${url}/tx/${txHash}`;
			}
			setIframeUrl(url);
		} else {
			reset();
		}
	};

	return {
		iframeUrl,
		updateIframeUrl,
	};
};
