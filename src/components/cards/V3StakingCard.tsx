import { FC, useState } from 'react';
import Image from 'next/image';
import {
	IconExternalLink,
	neutralColors,
	brandColors,
	Button,
	OulineButton,
	Overline,
	B,
	IconGiveth,
	IconETH,
} from '@giveth/ui-design-system';
import { Row } from '../styled-components/Grid';
import styled from 'styled-components';
import { useV3Staking } from '../../hooks/useV3Staking';
import { LiquidityPosition } from '../../types/nfts';

interface IV3StakeCardProps {
	position: LiquidityPosition;
	isUnstaking?: boolean;
}

const STARTS_WITH = 'data:application/json;base64,';

const V3StakingCard: FC<IV3StakeCardProps> = ({ position, isUnstaking }) => {
	const { transfer, exit } = useV3Staking(position.tokenId?.toNumber());

	const parseUri = (tokenURI: string) => {
		if (!tokenURI) return {};
		try {
			return JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
		} catch {
			return {};
		}
	};

	const { image } = parseUri(position.uri);

	const approveOrTransferOrStake = () => {
		if (isUnstaking) {
			return exit();
		} else {
			return transfer();
		}
	};

	return (
		<PositionContainer key={position.tokenId.toString()}>
			<Image
				src={image}
				width={72}
				height={124}
				alt='Liquidity Position NFT'
			/>
			<PositionInfo>
				<PositionInfoRow>
					<StyledOverline>LIQUIDITY</StyledOverline>
					<RoundedInfo>
						{position._position &&
							position._position?.pool.fee / 10000}
						%
					</RoundedInfo>
					<RoundedInfo>In Range</RoundedInfo>
				</PositionInfoRow>
				<TokenAmountRow>
					<IconGiveth size={16} />
					<TokenValue>10.01</TokenValue>
				</TokenAmountRow>
				<TokenAmountRow>
					<IconETH size={16} />
					<TokenValue>10.01</TokenValue>
				</TokenAmountRow>
			</PositionInfo>
			<PositionActions>
				{isUnstaking ? (
					<OulineButton
						label='UNSTAKE'
						onClick={approveOrTransferOrStake}
					/>
				) : (
					<FullWidthButton
						buttonType='primary'
						label='STAKE'
						onClick={approveOrTransferOrStake}
					/>
				)}
				<FullWidthButton
					label='VIEW POSITION'
					onClick={() =>
						window.open(
							`https://app.uniswap.org/#/pool/${position.tokenId.toString()}`,
						)
					}
					buttonType='texty'
					icon={
						<IconExternalLink
							size={16}
							color={brandColors.deep[100]}
						/>
					}
				/>
			</PositionActions>
		</PositionContainer>
	);
};

export const PositionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	border-radius: 8px;
	padding: 12px 24px;
	background: ${brandColors.giv[400]};
	color: ${neutralColors.gray[100]};
`;

export const PositionInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: ${neutralColors.gray[100]};
`;

export const PositionInfoRow = styled(Row)`
	align-items: center;
	gap: 8px;
`;

export const TokenAmountRow = styled(Row)`
	align-items: center;
	gap: 4px;
`;

export const StyledOverline = styled(Overline)`
	color: ${brandColors.deep[100]};
`;

const RoundedInfo = styled.div`
	background: ${brandColors.giv[600]};
	border-radius: 28px;
	font-weight: bold;
	padding: 4px 10px;
`;

export const TokenValue = styled(B)``;

export const PositionActions = styled.div`
	display: flex;
	width: 180px;
	flex-direction: column;
	gap: 12px;
`;

export const FullWidthButton = styled(Button)`
	width: 100%;
`;

export default V3StakingCard;
