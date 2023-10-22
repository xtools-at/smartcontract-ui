import { useRef, MouseEvent, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { Instance } from "@popperjs/core";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { chains } from "config/chains";
import { Chain } from "types/Chain";
import { query } from "utils/jsonQuery";
import Autocomplete from "@mui/material/Autocomplete";
import { log } from "utils/logger";
import { SlideUpTransition } from "utils/transitions";
import { basePath, corsProxyUrlPrefix } from "config/app";

export const SourceBrowser = ({
	onFileChange,
	source,
	onSourceChange,
	onUrlChange,
	onJsonChange,
	onError,

	chain,
	onChainChange,

	address,
	onAddressChange,

	onAbiImport,

	importDialogIsOpen,
	toggleImportDialog,
}: {
	onFileChange: (event: any) => void;
	source: string;
	onSourceChange: (source: string) => void;
	onUrlChange: (url: string) => void;
	onJsonChange: (json: any) => void;
	onError: (err: any) => void;

	chain: Chain | null | undefined;
	onChainChange: (chain: Chain | null | undefined) => void;

	address: string;
	onAddressChange: (address: string) => void;

	onAbiImport: (abi: any) => void;

	importDialogIsOpen: boolean;
	toggleImportDialog: (open: boolean) => void;
}) => {
	const positionRef = useRef<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const popperRef = useRef<Instance>(null);
	const areaRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			positionRef.current = { x: event.clientX, y: event.clientY };

			if (popperRef.current != null) {
				popperRef.current.update();
			}
		},
		[positionRef, popperRef]
	);

	const [isImporting, toggleImportStatus] = useState(false);

	const closeImportDialog = useCallback(() => {
		toggleImportStatus(false);
		toggleImportDialog(false);
	}, []);

	const [chainSearchText, searchChain] = useState<string>("");

	const importAbiSourcify = async (chain: Chain) => {
		// Sourcify.dev
		const urlPartial = `${corsProxyUrlPrefix}${encodeURIComponent(
			`https://repo.sourcify.dev/contracts/partial_match/${chain.chainId}/${address}/metadata.json`
		)}`;
		const urlFull = `${corsProxyUrlPrefix}${encodeURIComponent(
			`https://repo.sourcify.dev/contracts/full_match/${chain.chainId}/${address}/metadata.json`
		)}`;
		let data;

		toggleImportStatus(true);

		try {
			data = await (await fetch(urlFull, {})).json();
			data = JSON.parse(data);
		} catch (e1) {
			try {
				data = await (await fetch(urlPartial, {})).json();
				data = JSON.parse(data);
			} catch (e2) {}
		}

		if (data?.output?.abi) {
			const { abi } = data.output;
			log("abi", abi);
			onAbiImport(abi);

			toggleImportDialog(false);
			toggleImportStatus(false);
		} else {
			toggleImportStatus(false);
			onError(`No or invalid ABI received from ${chain.name}`);
		}
	};

	const importAbi = useCallback(async () => {
		if (chain) {
			const abiUrl = chain.abi?.replace("${ADDRESS}", address);

			if (abiUrl) {
				const [jsonPath, url] = abiUrl?.split(" ") as string[];

				if (jsonPath && url) {
					let data = "";
					try {
						toggleImportStatus(true);

						data = await (await fetch(url, {})).json();
						const abiJson = query(data, jsonPath);
						data = abiJson;
						const abi = JSON.parse(abiJson);

						log("abi", abi);
						onAbiImport(abi);

						toggleImportDialog(false);
						toggleImportStatus(false);
					} catch (error) {
						await importAbiSourcify(chain);
					}
				}
			} else {
				await importAbiSourcify(chain);
			}
		}
	}, [chain, address]);

	return (
		<>
			<TextField
				inputRef={areaRef}
				onMouseMove={handleMouseMove}
				InputProps={{
					endAdornment: (
						<>
							<Tooltip
								title="Paste or browse for an ABI file."
								arrow
								PopperProps={{
									popperRef,
									anchorEl: {
										getBoundingClientRect: () => {
											return new DOMRect(
												positionRef.current.x,
												areaRef.current!.getBoundingClientRect().y + 75,
												0,
												0
											);
										},
									},
								}}
							>
								<IconButton aria-label="upload" component="label">
									<UploadFileIcon />
									<input
										hidden
										accept="application/JSON"
										type="file"
										onChange={onFileChange}
									/>
								</IconButton>
							</Tooltip>
						</>
					),
				}}
				margin="normal"
				value={source}
				onChange={(event) => {
					onSourceChange(event.target.value);
				}}
				onKeyUp={(event) => {
					if (event.key === "Enter") {
						if (source.startsWith("http")) {
							onUrlChange(source);
						} else {
							try {
								const jsonContent = JSON.parse(source);
								onJsonChange(jsonContent);
							} catch (err) {
								onError(err);
							}
						}
					}
				}}
				fullWidth
				id="file"
				label="ABI"
				name="file"
				autoComplete="off"
				helperText={
					<>
						Try quicklinks:{" "}
						<Link
							href={`${
								basePath || ""
							}/?json=/uniswapV2Router.json&address=0x965B104e250648d01d4B3b72BaC751Cde809D29E&func=getAmountsIn&network=4337&args.amountOut=0.1e18&args.path=0xD51BFa777609213A653a2CD067c9A0132a2D316A,0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304`}
						>
							BeamSwap
						</Link>
						,{" "}
						<Link
							href={`${
								basePath || ""
							}/?json=/weth.json&address=0xD51BFa777609213A653a2CD067c9A0132a2D316A&func=deposit&eth=0.1e18&network=4337`}
						>
							WMC
						</Link>
						,{" "}
						<Link
							href={`${
								basePath || ""
							}/?json=/erc20.json&address=0x76BF5E7d2Bcb06b1444C0a2742780051D8D0E304&func=transfer&args.amount=100e6&network=4337`}
						>
							USDC
						</Link>
						,{" "}
						<Link
							href={`${
								basePath || ""
							}/?json=/erc20.json&address=0x00E69e0b6014d77040b28E04F2b8ac25A6EA5d34&func=transfer&args.amount=10e18&network=4337`}
						>
							ERC20
						</Link>
						,{" "}
						<Link
							href={`${
								basePath || ""
							}/?json=/erc721.json&address=0x6702e778780AD5f0d1C1C53E367971B1ad3FD223&func=name&network=4337`}
						>
							ERC721
						</Link>
						,{" "}
						<Link
							href={`${basePath || ""}/?json=/erc1155.json&func=uri&args.id=1`}
						>
							ERC1155
						</Link>
						.
						<br />
						Or{" "}
						<Link
							sx={{ cursor: "pointer" }}
							onClick={() => {
								toggleImportDialog(true);
							}}
						>
							import contract ABI
						</Link>{" "}
						from Etherscan/Sourcify.
					</>
				}
			/>

			<Dialog
				TransitionComponent={SlideUpTransition}
				open={importDialogIsOpen}
				onClose={closeImportDialog}
			>
				<DialogTitle>Import SmartContract ABI</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You can import the SmartContract's ABI code by specifying its
						deployed network and address.
						<br />
						<br />
					</DialogContentText>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Autocomplete
								// disablePortal
								fullWidth
								options={chains}
								getOptionLabel={(option) => option.name}
								renderInput={(params) => (
									<TextField {...params} label="Network" />
								)}
								value={chain}
								onChange={(_, newValue: Chain | null) => {
									/*
									if (newValue !== null) {
										if (!newValue.abi) {
											onError(
												`Unfortunately, importing SmartContract from ${newValue.name} is not supported for now`
											);
											return;
										}
									}
									*/
									onChainChange(newValue);
								}}
								inputValue={chainSearchText}
								onInputChange={(_, newInputValue) => {
									searchChain(newInputValue);
								}}
							/>
						</Grid>
						<Grid item xs={12} md={8}>
							<TextField
								autoFocus
								label="Contract's Address"
								type="text"
								fullWidth
								value={address}
								onChange={(event) => onAddressChange(event.target.value)}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions
					sx={{
						marginRight: "18px",
						marginBottom: "10px",
					}}
				>
					<Button onClick={closeImportDialog}>Cancel</Button>
					<LoadingButton
						loading={isImporting}
						onClick={importAbi}
						variant="contained"
					>
						Import
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	);
};
