import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Onboard } from '../src/providers/onboard'
import { User } from '../src/providers/user'
import { ThemeProvider } from '../src/providers/theme'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<User>
			<Onboard>
				<ThemeProvider>
					<Component {...pageProps} />
				</ThemeProvider>
			</Onboard>
		</User>
	)
}
export default MyApp
