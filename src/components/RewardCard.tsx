import config from '@/configuration';
import { formatWeiHelper, Zero } from '@/helpers/number';
import { getGIVPrice } from '@/services/subgraph';
import {
	brandColors,
	Caption,
	Lead,
	Overline,
	Title,
	P,
	IconGIVStream,
	IconHelp,
	Button,
} from '@giveth/ui-design-system';
import React, {
	FC,
	MouseEventHandler,
	useEffect,
	useContext,
	useState,
} from 'react';
import styled from 'styled-components';
import { IconGIV } from './Icons/GIV';
import { IconXDAI } from './Icons/XDAI';
import { Row } from './styled-components/Grid';
import { OnboardContext } from '@/context/onboard.context';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { IconEthereum } from './Icons/Eth';
import { WhatisGIVstreamModal } from '@/components/modals/WhatisGIVstream';

interface IRewardCardProps {
	title?: string;
	liquidAmount: ethers.BigNumber;
	stream: BigNumber.Value;
	actionLabel?: string;
	actionCb?: MouseEventHandler<HTMLButtonElement>;
	network: number;
	className?: string;
}

export const RewardCard: FC<IRewardCardProps> = ({
	title = 'Your Rewards',
	liquidAmount = ethers.constants.Zero,
	stream = Zero,
	actionLabel,
	actionCb,
	network,
	className,
}) => {
	const [usdAmount, setUSDAmount] = useState('0');
	const [showWhatIsGIVstreamModal, setShowWhatIsGIVstreamModal] =
		useState(false);
	useEffect(() => {
		getGIVPrice(network).then(price => {
			const usd = (
				+ethers.utils.formatEther(liquidAmount) * price
			).toFixed(2);
			setUSDAmount(usd);
		});
	}, [liquidAmount, network]);

	return (
		<>
			<RewadCardContainer className={className}>
				<CardHeader justifyContent='space-between'>
					<CardTitle>{title}</CardTitle>
					<ChainInfo alignItems='center'>
						{network === config.MAINNET_NETWORK_NUMBER && (
							<IconEthereum size={16} />
						)}
						{network === config.XDAI_NETWORK_NUMBER && (
							<IconXDAI size={16} />
						)}
						<ChainName styleType='Small'>
							{network === config.MAINNET_NETWORK_NUMBER
								? 'ETH'
								: 'XDAI'}
						</ChainName>
					</ChainInfo>
				</CardHeader>
				<AmountInfo alignItems='center' gap='8px'>
					<IconGIV size={32} />
					<Title>{formatWeiHelper(liquidAmount)}</Title>
					<AmountUnit>GIV</AmountUnit>
				</AmountInfo>
				<Converted>~${usdAmount}</Converted>
				<RateInfo alignItems='center' gap='8px'>
					<IconGIVStream size={24} />
					<P>{formatWeiHelper(stream)}</P>
					<RateUnit>GIV/week</RateUnit>
					<IconHelpWraper
						onClick={() => {
							setShowWhatIsGIVstreamModal(true);
						}}
					>
						<IconHelp size={24} color={brandColors.deep[200]} />
					</IconHelpWraper>
				</RateInfo>
				{actionLabel && actionCb && (
					<ActionButton
						label={actionLabel}
						onClick={actionCb}
						buttonType='primary'
					/>
				)}
			</RewadCardContainer>
			{showWhatIsGIVstreamModal && (
				<WhatisGIVstreamModal
					showModal={showWhatIsGIVstreamModal}
					setShowModal={setShowWhatIsGIVstreamModal}
				/>
			)}
		</>
	);
};

const RewadCardContainer = styled.div`
	width: 360px;
	background-color: ${brandColors.giv[700]};
	padding: 24px 24px 69px;
	border-radius: 8px;
	box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.15);
`;

const CardHeader = styled(Row)`
	color: ${brandColors.deep[100]};
	margin-bottom: 16px;
`;

const ChainInfo = styled(Row)`
	gap: 4px;
`;

const ChainName = styled(Overline)``;

const CardTitle = styled(Caption)``;

const AmountInfo = styled(Row)``;

const AmountUnit = styled(Lead)`
	color: ${brandColors.deep[100]};
`;

const Converted = styled(P)`
	color: ${brandColors.deep[200]};
	margin-left: 40px;
	margin-bottom: 22px;
`;

const RateInfo = styled(Row)`
	margin-bottom: 12px;
`;

const RateUnit = styled(Lead)`
	color: ${brandColors.deep[100]};
`;

const ActionButton = styled(Button)`
	width: 100%;
`;

const IconHelpWraper = styled.div`
	cursor: pointer;
`;
