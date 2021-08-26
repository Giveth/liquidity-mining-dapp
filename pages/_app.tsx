import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { OnboardProvider } from '../src/context/onboard.context'
import { UserProvider } from '../src/context/user.context'
import { ThemeProvider } from '../src/context/theme.context'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<ThemeProvider>
					<Component {...pageProps} />
				</ThemeProvider>
			</OnboardProvider>
		</UserProvider>
	)
}
export default MyApp
