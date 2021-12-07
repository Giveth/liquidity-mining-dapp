import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { UserProvider } from '@/context/user.context';
import { ThemeProvider } from '@/context/theme.context';
import { BalanceProvider } from '@/context/balance.context';
import { FarmProvider } from '@/context/farm.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<BalanceProvider>
					<TokenDistroProvider>
						<NftsProvider>
							<FarmProvider>
								<ThemeProvider>
									<Component {...pageProps} />
								</ThemeProvider>
							</FarmProvider>
						</NftsProvider>
					</TokenDistroProvider>
				</BalanceProvider>
			</OnboardProvider>
		</UserProvider>
	);
}
export default MyApp;
