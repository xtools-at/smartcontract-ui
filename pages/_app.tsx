import { useMemo } from "react";
import Head from "next/head";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "utils/createEmotionCache";
import { SnackbarProvider } from "notistack";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import {
	basePath,
	name,
	title,
	description,
	host,
	creatorTwitter,
} from "../config/app";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

const getWeb3Library = (provider: any): Web3Provider => {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
};

export default function App(props: MyAppProps) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? "dark" : "light",
				},
			}),
		[prefersDarkMode]
	);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta
					name="viewport"
					content="minimal-ui=yes, width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"
				/>
				<meta property="og:site_name" content={name} />
				<meta property="og:title" content={title} />
				<meta property="og:url" content={`${host}${basePath}`} />
				<meta
					property="og:image"
					content={`${host}${basePath}/icons/512-maskable.png`}
				/>
				<meta property="og:description" content={description} />
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="en" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content={name} />
				<meta name="twitter:description" content={description} />
				<meta
					name="twitter:image:src"
					content={`${host}${basePath}/icons/512-maskable.png`}
				/>
				<meta name="twitter:creator" content={creatorTwitter} />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<SnackbarProvider maxSnack={3}>
					<Web3ReactProvider getLibrary={getWeb3Library}>
						<Component {...pageProps} />
					</Web3ReactProvider>
				</SnackbarProvider>
			</ThemeProvider>
		</CacheProvider>
	);
}
