import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "utils/createEmotionCache";
import { basePath } from "../config/app";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link rel="manifest" href={`${basePath || ""}/manifest.json`} />
					<link
						rel="icon"
						href={`${basePath || ""}/favicon.ico`}
						type="image/x-icon"
						sizes="any"
					/>
					<link
						rel="icon"
						href={`${basePath || ""}/icons/192.png`}
						type="image/png"
						sizes="192x192"
					/>
					<link
						rel="icon"
						href={`${basePath || ""}/icons/512.png`}
						type="image/png"
						sizes="512x512"
					/>
					<link
						rel="apple-touch-icon"
						href={`${basePath || ""}/icons/apple-touch-icon.png`}
					/>
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="format-detection" content="telephone=no" />

					<script
						dangerouslySetInnerHTML={{
							__html: `
							if (location.port !== '3000' && location.protocol !== 'https:') {
								location.replace('https:' + location.href.substring(location.protocol.length));
							}
							`,
						}}
					></script>
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: `
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'url': 'https://xtools-at.github.io/smartcontract-ui'
              }`,
						}}
					></script>
				</Head>
				<body>
					<Main />
					<NextScript />

					<script
						dangerouslySetInnerHTML={{
							__html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('${
								basePath || ""
							}/sw.js') }`,
						}}
					></script>
				</body>
			</Html>
		);
	}
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	const originalRenderPage = ctx.renderPage;

	// You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
	// However, be aware that it can have global side effects.
	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App: any) => (props) =>
				<App emotionCache={cache} {...props} />,
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents emotion to render invalid HTML.
	// See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(" ")}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: [
			...React.Children.toArray(initialProps.styles),
			...emotionStyleTags,
		],
	};
};
