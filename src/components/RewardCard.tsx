import config from '@/configuration';
import { formatEthHelper, formatWeiHelper, Zero } from '@/helpers/number';
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
import BigNumber from 'bignumber.js';
import React, { FC, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { IconGIV } from './Icons/GIV';
import { IconXDAI } from './Icons/XDAI';
import { Row } from './styled-components/Grid';

interface IRewardCardProps {
	title?: string;
	amount?: BigNumber;
	rate?: BigNumber;
	actionLabel?: string;
	actionCb?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export const RewardCard: FC<IRewardCardProps> = ({
	title = 'Your Rewards',
	amount = Zero,
	rate = Zero,
	actionLabel,
	actionCb,
	className,
}) => {
	return (
		<RewadCardContainer className={className}>
			<CardHeader justifyContent='space-between'>
				<CardTitle>{title}</CardTitle>
				<ChainInfo>
					<IconXDAI size={16} />
					<ChainName styleType='Small'>XDAI</ChainName>
				</ChainInfo>
			</CardHeader>
			<AmountInfo alignItems='center' gap='8px'>
				<IconGIV size={32} />
				<Title>{formatWeiHelper(amount, config.TOKEN_PRECISION)}</Title>
				<AmountUnit>GIV</AmountUnit>
			</AmountInfo>
			<Converted>~$348.74</Converted>
			<RateInfo alignItems='center' gap='8px'>
				<IconGIVStream size={24} />
				<P>{formatEthHelper(rate, config.TOKEN_PRECISION)}</P>
				<RateUnit>GIV/week</RateUnit>
				<IconHelp size={24} color={brandColors.deep[200]} />
			</RateInfo>
			{actionLabel && actionCb && (
				<ActionButton
					label={actionLabel}
					onClick={actionCb}
					buttonType='primary'
				/>
			)}
		</RewadCardContainer>
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

const ChainInfo = styled(Row)``;

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
