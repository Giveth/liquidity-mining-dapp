import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { ThemeProvider } from '@/context/theme.context';
import { BalanceProvider } from '@/context/balance.context';
import { FarmProvider } from '@/context/farm.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';

import { MobileModal } from '@/components/modals/Mobile';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
	const [showMobileModal, setShowMobileModal] = useState(false);

	useEffect(() => {
		if (window.screen.width < 640) setShowMobileModal(true);
	}, []);

	return (
		<OnboardProvider>
			<BalanceProvider>
				<TokenDistroProvider>
					<NftsProvider>
						<FarmProvider>
							<ThemeProvider>
								<Component {...pageProps} />
								{showMobileModal && (
									<MobileModal
										showModal={showMobileModal}
										setShowModal={setShowMobileModal}
									/>
								)}
							</ThemeProvider>
						</FarmProvider>
					</NftsProvider>
				</TokenDistroProvider>
			</BalanceProvider>
		</OnboardProvider>
	);
}
export default MyApp;
