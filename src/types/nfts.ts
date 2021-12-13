import BigNumber from 'bignumber.js';
import { Position } from '@uniswap/v3-sdk';

export type LiquidityPosition = {
	owner: string;
	staked: boolean;
	numberOfStakes: number;
	tokenId: number;
	uri: string;
	forTotalLiquidity: boolean;
	_position: Position | null;
};
