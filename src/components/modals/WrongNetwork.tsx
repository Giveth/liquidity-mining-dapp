import config from '@/configuration';
import { P, B, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { Row } from '../styled-components/Grid';
import { IconEthereum } from '../Icons/Eth';
import { IconXDAI } from '../Icons/XDAI';

interface IWrongNetworkInnerModal {
	targetNetwork: number;
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	targetNetwork,
}) => {
	return (
		<WrongNetworkInnerModalContainer>
			{targetNetwork === config.MAINNET_NETWORK_NUMBER ? (
				<IconEthereum size={64} />
			) : (
				<IconXDAI size={64} />
			)}
			<Description>
				<P>Please change your network to</P>
				<B>
					{targetNetwork === config.MAINNET_NETWORK_NUMBER
						? 'Ethereum'
						: 'xDai'}
				</B>
			</Description>
		</WrongNetworkInnerModalContainer>
	);
};

const WrongNetworkInnerModalContainer = styled.div`
	padding: 50px 25px 25px;
`;

const Description = styled(Row)`
	padding: 25px;
	color: ${neutralColors.gray[100]};
	gap: 4px;
`;
