import React, { FC, useEffect, useState } from 'react';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { DurationToString } from '@/lib/helpers';
import {
	Bar,
	GsPTooltip,
	PercentageRow,
} from '@/components/homeTabs/GIVstream.sc';
import {
	B,
	brandColors,
	H4,
	H5,
	H6,
	IconGIVStream,
	IconHelp,
	P,
} from '@giveth/ui-design-system';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { RegenStreamConfig, StreamType } from '@/types/config';
import { useSubgraph } from '@/context';
import { constants, ethers } from 'ethers';
import { formatWeiHelper } from '@/helpers/number';
import { IconFox } from '@/components/Icons/Fox';
import BigNumber from 'bignumber.js';
import { Row } from '@/components/styled-components/Grid';
import styled from 'styled-components';
import { RegenRewardCard } from './RegenRewardCard';

export enum RegenStreamSize {
	SMALL,
	BIG,
}
interface RegenStreamProps {
	network: number;
	streamConfig: RegenStreamConfig;
	size?: RegenStreamSize;
}

export const getStreamIconWithType = (type: StreamType, size?: number) => {
	switch (type) {
		case StreamType.FOX:
			return <IconFox size={size} />;
		default:
			break;
	}
};

export const RegenStream: FC<RegenStreamProps> = ({
	network,
	streamConfig,
	size = RegenStreamSize.BIG,
}) => {
	const { regenTokenDistroHelpers } = useTokenDistro();
	const [rewardLiquidPart, setRewardLiquidPart] = useState(constants.Zero);
	const [rewardStream, setRewardStream] = useState<BigNumber.Value>(0);
	const [lockedAmount, setLockedAmount] = useState<ethers.BigNumber>(
		constants.Zero,
	);
	const [claimedAmount, setClaimedAmount] = useState<ethers.BigNumber>(
		constants.Zero,
	);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const tokenDistroHelper = regenTokenDistroHelpers[streamConfig.type];

	useEffect(() => {
		switch (streamConfig.type) {
			case StreamType.FOX:
				setLockedAmount(balances.foxAllocatedTokens);
				setClaimedAmount(balances.foxClaimed);
				break;
			default:
				setLockedAmount(ethers.constants.Zero);
				setClaimedAmount(ethers.constants.Zero);
		}
	}, [streamConfig.type, balances]);

	useEffect(() => {
		if (!tokenDistroHelper) return;
		setRewardLiquidPart(
			tokenDistroHelper.getLiquidPart(lockedAmount).sub(claimedAmount),
		);
		setRewardStream(
			tokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount),
		);
	}, [claimedAmount, lockedAmount, tokenDistroHelper]);

	const percentage = tokenDistroHelper?.percent || 0;
	const remainTime = DurationToString(tokenDistroHelper?.remain || 0);

	const icon = getStreamIconWithType(streamConfig.type, 40);

	return (
		<>
			<RegenStreamContainer size={size}>
				<Info>
					<RegenStreamTitleRow>
						{icon}
						<H5>{streamConfig.rewardTokenSymbol} Flowrate</H5>
						<IconGIVStream size={32} />
						<StreamRate>{formatWeiHelper(rewardStream)}</StreamRate>
						<StreamRateUnit>
							{streamConfig.rewardTokenSymbol}/week
						</StreamRateUnit>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'right'}
						>
							<GsPTooltip>
								Time left for the{' '}
								{streamConfig.rewardTokenSymbol}
								stream to reach full power!
							</GsPTooltip>
						</IconWithTooltip>
					</RegenStreamTitleRow>
					<RegenStreamInfoRow>
						<Row alignItems='flex-end' gap='6px'>
							<H6>
								{streamConfig.rewardTokenSymbol}stream prgress
							</H6>

							<IconWithTooltip
								icon={<IconHelp size={16} />}
								direction={'right'}
							>
								<GsPTooltip>
									Time left for the{'	 '}
									{streamConfig.rewardTokenSymbol}
									stream to reach full power!
								</GsPTooltip>
							</IconWithTooltip>
						</Row>
						<P>{`Time remaining: ` + remainTime}</P>
					</RegenStreamInfoRow>
					<Bar percentage={percentage} />
					<PercentageRow justifyContent='space-between'>
						<B>{percentage?.toFixed(2)}%</B>
						<B>100%</B>
					</PercentageRow>
				</Info>
				<RegenRewardCard
					network={network}
					streamConfig={streamConfig}
					liquidAmount={rewardLiquidPart}
				/>
			</RegenStreamContainer>
		</>
	);
};

const RegenStreamContainer = styled(Row)<{ size: RegenStreamSize }>`
	gap: 24px;
`;

const RegenStreamTitleRow = styled(Row)`
	gap: 8px;
	align-items: flex-end;
	margin-bottom: 26px;
`;

const StreamRate = styled(H4)`
	line-height: 2.4rem;
`;

const StreamRateUnit = styled(H6)`
	color: ${brandColors.giv[200]};
`;

const RegenStreamInfoRow = styled(Row)`
	justify-content: space-between;
	margin-bottom: 24px;
`;

const Info = styled.div`
	flex: 1;
`;
