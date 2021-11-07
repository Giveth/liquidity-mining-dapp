import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { UserProvider } from '@/context/user.context';
import { ThemeProvider } from '@/context/theme.context';
import { TokenBalanceProvider } from '@/context/tokenBalance.context';
import { ContractsProvider } from '@/context/useContracts';
import { ERC721NftsProvider } from '@/context/useV3Liquidity';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<OnboardProvider>
				<ContractsProvider>
					<ERC721NftsProvider>
						<TokenBalanceProvider>
							<ThemeProvider>
								<Component {...pageProps} />
							</ThemeProvider>
						</TokenBalanceProvider>
					</ERC721NftsProvider>
				</ContractsProvider>
			</OnboardProvider>
		</UserProvider>
	);
}
export default MyApp;
