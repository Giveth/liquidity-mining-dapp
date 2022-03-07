import config from '@/configuration';
import { supportedNetworks } from '@/utils/constants';
import { H3, Lead } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { GIVfrensLink } from './GIVfrens.sc';
import { RegenStream } from './RegenStream';
import { GsMultiverseDataBlock } from './homeTabs/GIVstream.sc';

const RegenStreamBlock = () => {
	const { chainId } = useWeb3React();

	const networkConfig =
		chainId === config.XDAI_NETWORK_NUMBER
			? config.XDAI_CONFIG
			: config.MAINNET_CONFIG;
	const { regenStreams } = networkConfig;

	return regenStreams.length > 0 ? (
		<RegenStreamBlockContainer>
			<Title weight={700}>Regen stream</Title>
			<Desc>
				When you harvest farming rewards from the Giveth Multiverse, a
				portion of the rewards is added to a Multiverse Stream. Each
				stream flows continuously until its respective end date.{' '}
				<GIVfrensLink
					size='Big'
					href='https://medium.com/giveth/farm-to-table-yields-with-decentralized-philanthropy-a5d71d28ef0d'
				>
					Learn more
				</GIVfrensLink>
				.
			</Desc>

			{regenStreams.map(streamConfig => {
				return (
					<RegenStream
						key={streamConfig.type}
						streamConfig={streamConfig}
						network={
							supportedNetworks.includes(chainId as number)
								? (chainId as number)
								: config.MAINNET_NETWORK_NUMBER
						}
					/>
				);
			})}
		</RegenStreamBlockContainer>
	) : null;
};

const RegenStreamBlockContainer = styled.div`
	margin: 48px 0;
`;

const Title = styled(H3)`
	margin-bottom: 16px;
`;

const Desc = styled(Lead)`
	width: 60%;
	margin-bottom: 48px;
`;

export default RegenStreamBlock;
