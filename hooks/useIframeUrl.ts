import { useState } from "react";
import { iframeUrl as baseIframeUrl, chainExplorerIframe } from "config/app";
import { Chain } from "types/Chain";

export const useIframeUrl = () => {
	const [iframeUrl, setIframeUrl] = useState(baseIframeUrl || "");

	const updateIframeUrl = (
		chain: Chain | null | undefined,
		address: string | null | undefined,
		txHash: string | null | undefined
	) => {
		if (
			baseIframeUrl &&
			chain?.explorers?.length &&
			chainExplorerIframe.includes(chain.chainId)
		) {
			let url = `${chain.explorers[0].url}${txHash ? `/tx/${txHash}` : ""}`;
			if (url.endsWith("/")) url = url.substring(0, url.length - 1);

			if (address && !txHash) {
				url = `${url}/address/${address}`;
			} else if (txHash) {
				url = `${url}/tx/${txHash}`;
			}
			setIframeUrl(url);
		} else if (baseIframeUrl && iframeUrl !== baseIframeUrl) {
			setIframeUrl(baseIframeUrl);
		}
	};

	return {
		iframeUrl,
		updateIframeUrl,
	};
};
