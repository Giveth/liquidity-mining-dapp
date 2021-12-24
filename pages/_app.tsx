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
import { ComingSoon } from '@/components/modals/ComingSoon';

function MyApp({ Component, pageProps }: AppProps) {
	const [showMobileModal, setShowMobileModal] = useState(false);
	const [showcommingSoon, setShowcommingSoon] = useState(true);

	useEffect(() => {
		if (window.screen.width < 640) setShowMobileModal(true);
	}, []);

	return (
		<>
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
			{showcommingSoon && (
				<ComingSoon
					showModal={showcommingSoon}
					setShowModal={setShowcommingSoon}
				/>
			)}
		</>
	);
}
export default MyApp;
