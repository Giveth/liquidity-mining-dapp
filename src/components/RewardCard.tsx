import {
	brandColors,
	Caption,
	IconGiveth,
	Lead,
	Overline,
	Title,
	P,
	IconGIVStream,
	IconHelp,
	Button,
} from '@giveth/ui-design-system';
import React, { FC, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { Row } from './styled-components/Grid';

interface IRewardCardProps {
	amount: number;
	actionLabel?: string;
	actionCb?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export const RewardCard: FC<IRewardCardProps> = ({
	amount,
	actionLabel,
	actionCb,
	className,
}) => {
	return (
		<RewadCardContainer className={className}>
			<CardHeader justifyContent='space-between'>
				<CardTitle>Total Claimable Rewards</CardTitle>
				<ChainInfo>
					<IconGiveth size={16} /> {/* it sould change to xdai */}
					<ChainName styleType='Small'>XDAI</ChainName>
				</ChainInfo>
			</CardHeader>
			<AmountInfo alignItems='center' gap='8px'>
				<IconGiveth size={32} />
				<Title>{amount}</Title>
				<AmountUnit>GIV</AmountUnit>
			</AmountInfo>
			<Converted>~$348.74</Converted>
			<RateInfo alignItems='center' gap='8px'>
				<IconGIVStream size={24} />
				<P>9.588</P>
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
