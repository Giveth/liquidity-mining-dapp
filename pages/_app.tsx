import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { UserProvider } from '@/context/user.context';
import { ThemeProvider } from '@/context/theme.context';
import { TokenBalanceProvider } from '@/context/tokenBalance.context';

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
