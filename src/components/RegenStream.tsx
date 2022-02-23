import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { DurationToString } from '@/lib/helpers';
import {
	Bar,
	GIVstreamProgressContainer,
	GIVstreamRewardCard,
	GsPTitle,
	GsPTitleRow,
	GsPTooltip,
	Left,
	PercentageRow,
	Right,
} from '@/components/homeTabs/GIVstream.sc';
import {
	B,
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
import { formatWeiHelper, Zero } from '@/helpers/number';
import { IconFox } from '@/components/Icons/Fox';
import { usePrice } from '@/context/price.context';
import BigNumber from 'bignumber.js';
import { Row } from '@/components/styled-components/Grid';
import config from '@/configuration';
import { HarvestAllModal } from '@/components/modals/HarvestAll';

interface RegenStreamProps {
	network: number;
	streamConfig: RegenStreamConfig;
}
export const getStreamIconWithType = (type: StreamType) => {
	switch (type) {
		case StreamType.FOX:
			return <IconFox />;
		default:
			break;
	}
};

export const RegenStream: FC<RegenStreamProps> = ({
	network,
	streamConfig,
}) => {
	const { regenTokenDistroHelpers } = useTokenDistro();
	const { getTokenPrice } = usePrice();
	const [tokenPrice, setTokenPrice] = useState<BigNumber>(Zero);
	const [showModal, setShowModal] = useState(false);
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
		setTokenPrice(getTokenPrice(streamConfig.tokenAddress, network));
	}, [getTokenPrice, network, streamConfig]);

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

	return (
		<Row justifyContent='space-between'>
			<Left>
				<GIVstreamProgressContainer>
					<GsPTitleRow justifyContent='space-between'>
						<GsPTitle alignItems='center' gap='8px'>
							{getStreamIconWithType(streamConfig.type)}
							<H5>{streamConfig.title} Flowrate</H5>
							<IconGIVStream size={32} />
							<H4>{formatWeiHelper(rewardStream)}</H4>
							<H6>{streamConfig.tokenSymbol}/week</H6>
							<IconWithTooltip
								icon={<IconHelp size={16} />}
								direction={'right'}
							>
								<GsPTooltip>
									Time left for the {streamConfig.title}
									to reach full power!
								</GsPTooltip>
							</IconWithTooltip>
						</GsPTitle>
						<P>{`Time remaining: ` + remainTime}</P>
					</GsPTitleRow>
					<Bar percentage={percentage} />
					<PercentageRow justifyContent='space-between'>
						<B>{percentage?.toFixed(2)}%</B>
						<B>100%</B>
					</PercentageRow>
				</GIVstreamProgressContainer>
			</Left>
			<Right>
				<GIVstreamRewardCard
					wrongNetworkText='Stream is only available on Mainnet and xDAI.'
					title={''}
					liquidAmount={rewardLiquidPart}
					stream={rewardStream}
					actionLabel='HARVEST'
					actionCb={() => {
						setShowModal(true);
					}}
					network={network}
					targetNetworks={[
						config.MAINNET_NETWORK_NUMBER,
						config.XDAI_NETWORK_NUMBER,
					]}
					tokenSymbol={streamConfig.tokenSymbol}
					tokenPrice={tokenPrice}
				/>
				{showModal && (
					<HarvestAllModal
						title={streamConfig.title + ' Rewards'}
						showModal={showModal}
						setShowModal={setShowModal}
						network={network}
						streamType={streamConfig.type}
						tokenPrice={tokenPrice}
					/>
				)}
			</Right>
		</Row>
	);
};
