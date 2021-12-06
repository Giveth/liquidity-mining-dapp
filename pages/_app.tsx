import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { UserProvider } from '@/context/user.context';
import { ThemeProvider } from '@/context/theme.context';
import { BalanceProvider } from '@/context/balance.context';
import { PoolsProvider } from '@/context/pools.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<BalanceProvider>
					<TokenDistroProvider>
						<PoolsProvider>
							<NftsProvider>
								<ThemeProvider>
									<Component {...pageProps} />
								</ThemeProvider>
							</NftsProvider>
						</PoolsProvider>
					</TokenDistroProvider>
				</BalanceProvider>
			</OnboardProvider>
		</UserProvider>
	);
}
export default MyApp;
