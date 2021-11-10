import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { UserProvider } from '@/context/user.context';
import { ThemeProvider } from '@/context/theme.context';
import { TokenBalanceProvider } from '@/context/tokenBalance.context';
import { NftsProvider } from '@/context/positions.context';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<TokenBalanceProvider>
					<NftsProvider>
						<ThemeProvider>
							<Component {...pageProps} />
						</ThemeProvider>
					</NftsProvider>
				</TokenBalanceProvider>
			</OnboardProvider>
		</UserProvider>
	);
}
export default MyApp;
