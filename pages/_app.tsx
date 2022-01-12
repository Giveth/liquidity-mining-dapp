import type { AppProps } from 'next/app';

import '../styles/globals.css';

import { OnboardProvider } from '@/context/onboard.context';
import { ThemeProvider } from '@/context/theme.context';
import { FarmProvider } from '@/context/farm.context';
import { NftsProvider } from '@/context/positions.context';
import { TokenDistroProvider } from '@/context/tokenDistro.context';

import { MobileModal } from '@/components/modals/Mobile';
import { useEffect, useState } from 'react';
import { SubgraphProvider } from '@/context/subgraph.context';
import Head from 'next/head';
import { PriceProvider } from '@/context/price.context';

function MyApp({ Component, pageProps }: AppProps) {
	const [showMobileModal, setShowMobileModal] = useState(false);
	const [viewPort, setViewPort] = useState(false);

	useEffect(() => {
		const windowResizeHandler = () => {
			if (window.screen.width < 768) {
				setShowMobileModal(true);
				setViewPort(true);
			} else {
				setShowMobileModal(false);
				setViewPort(false);
			}
		};
		windowResizeHandler();
		window.addEventListener('resize', windowResizeHandler);
		return () => {
			removeEventListener('resize', windowResizeHandler);
		};
	}, []);

	return (
		<>
			<Head>
				{viewPort && <meta name='viewport' content='width=768' />}
			</Head>
			<OnboardProvider>
				<SubgraphProvider>
					<TokenDistroProvider>
						<NftsProvider>
							<PriceProvider>
								<FarmProvider>
									<ThemeProvider>
										<Component {...pageProps} />
										{showMobileModal && (
											<MobileModal
												showModal={showMobileModal}
												setShowModal={
													setShowMobileModal
												}
											/>
										)}
									</ThemeProvider>
								</FarmProvider>
							</PriceProvider>
						</NftsProvider>
					</TokenDistroProvider>
				</SubgraphProvider>
			</OnboardProvider>
		</>
	);
}
export default MyApp;
