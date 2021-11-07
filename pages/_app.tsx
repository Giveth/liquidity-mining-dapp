import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { OnboardProvider } from '../src/context/onboard.context';
import { UserProvider } from '../src/context/user.context';
import { ThemeProvider } from '../src/context/theme.context';
import { TokenBalanceProvider } from '../src/context/tokenBalance.context';
import { ContractsProvider } from '../src/context/contracts';
import { ERC721NftsProvider } from '../src/context/nfts.context';

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
