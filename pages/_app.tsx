import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { OnboardProvider } from '../src/context/onboard.context';
import { UserProvider } from '../src/context/user.context';
import { ThemeProvider } from '../src/context/theme.context';
import { TokenBalanceProvider } from '../src/context/tokenBalance.context';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<TokenBalanceProvider>
					<ThemeProvider>
						<Component {...pageProps} />
					</ThemeProvider>
				</TokenBalanceProvider>
			</OnboardProvider>
		</UserProvider>
	);
}
export default MyApp;
