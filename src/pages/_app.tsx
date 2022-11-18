import { useRouter } from 'next/router'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { StyleProvider } from '@ledgerhq/react-ui'
import { ThemeNames } from '@ledgerhq/react-ui/styles'
import GlobalStyle from '@/styles/globalStyle'
import useInitialization from '../hooks/useInitialization'
import useWalletConnectEventsManager from 'src/hooks/useWalletConnectEventsManager'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const { theme = 'dark' } = router.query

	// Step 1 - Initialize wallets and wallet connect client
	useInitialization()

	// Step 2 - Once initialized, set up wallet connect event manager
	// useWalletConnectEventsManager(initialized)

	// ToDo: Step 3 - Use Legacy.
	// useWalletConnectEventsManager(initialized)

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>
			<StyleProvider
				selectedPalette={theme as ThemeNames | undefined}
				fontsPath="/fonts"
			>
				<GlobalStyle />
				<Component {...pageProps} />
			</StyleProvider>
		</>
	)
}

export default appWithTranslation(MyApp)
