import BigNumber from 'bignumber.js';
import { Position } from '@uniswap/v3-sdk';

export type LiquidityPosition = {
	owner: string;
	staked: boolean;
	tokenId: number;
	uri: string;
	_position: Position | null;
};
