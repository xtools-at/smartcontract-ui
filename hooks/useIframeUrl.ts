import { useState } from "react";
import { iframeUrl as baseIframeUrl } from "config/app";
import { Chain } from "types/Chain";
import { log } from "utils/logger";

export const useIframeUrl = () => {
	const [iframeUrl, setIframeUrl] = useState(baseIframeUrl || "");

	const reset = () => {
		if (baseIframeUrl && iframeUrl !== baseIframeUrl) {
			setIframeUrl(baseIframeUrl);
		} else if (!baseIframeUrl) {
			setIframeUrl("");
		}
	};

	const updateIframeUrl = (
		chain: Chain | null | undefined,
		address?: string,
		txHash?: string
	) => {
		if (baseIframeUrl && chain?.explorers?.length) {
			const explorer = chain.explorers.find((exp) => exp.iframe === true);
			if (!explorer) {
				reset();
				return;
			}

			let url = explorer.url;
			if (url.endsWith("/")) url = url.substring(0, url.length - 1);

			if (explorer.standard === "EIP3091" && !explorer.url.includes("?")) {
				if (address && !txHash) {
					url = `${url}/address/${address}`;
				} else if (txHash) {
					url = `${url}/tx/${txHash}`;
				}
			}

			if (url !== iframeUrl) {
				log("loading explorer url", url);
				setIframeUrl(url);
			}
		} else {
			reset();
		}
	};

	return {
		iframeUrl,
		updateIframeUrl,
	};
};
