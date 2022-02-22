import React, { FC, useMemo } from 'react';
import { useTokenDistro } from '@/context/tokenDistro.context';
import { DurationToString } from '@/lib/helpers';
import {
	Bar,
	GIVstreamProgressContainer,
	GsPTitle,
	GsPTitleRow,
	GsPTooltip,
	PercentageRow,
} from '@/components/homeTabs/GIVstream.sc';
import {
	B,
	H1,
	H4,
	H5,
	H6,
	IconGIVStream,
	IconHelp,
	P,
} from '@giveth/ui-design-system';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { RegenStreamConfig, StakingType, StreamType } from '@/types/config';
import { useSubgraph } from '@/context';
import { ethers } from 'ethers';
import { formatWeiHelper } from '@/helpers/number';
import { IconFox } from '@/components/Icons/Fox';

interface RegenStreamProps {
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

export const RegenStream: FC<RegenStreamProps> = ({ streamConfig }) => {
	const { regenTokenDistroHelpers } = useTokenDistro();
	const {
		currentValues: { balances },
	} = useSubgraph();
	const tokenDistroHelper = regenTokenDistroHelpers[streamConfig.type];

	const lockedAmount = useMemo(() => {
		switch (streamConfig.type) {
			case StreamType.FOX:
				return balances.foxAllocatedTokens;
			default:
				return ethers.constants.Zero;
		}
	}, [streamConfig.type, balances]);

	const flowrate = useMemo(() => {
		if (tokenDistroHelper)
			return tokenDistroHelper.getStreamPartTokenPerWeek(lockedAmount);
		return ethers.constants.Zero;
	}, [lockedAmount, tokenDistroHelper]);

	const percentage = tokenDistroHelper?.percent || 0;
	const remainTime = DurationToString(tokenDistroHelper?.remain || 0);

	return (
		<GIVstreamProgressContainer>
			<GsPTitleRow justifyContent='space-between'>
				<GsPTitle alignItems='center' gap='8px'>
					{getStreamIconWithType(streamConfig.type)}
					<H5>{streamConfig.title} Flowrate</H5>
					<IconGIVStream size={24} />
					<H4>{formatWeiHelper(flowrate)}</H4>
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
	);
};
