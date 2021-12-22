import { Position } from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers';
export interface LiquidityPosition {
	owner: string;
	staked: boolean;
	tokenId: number;
	uri: string;
	_position: Position | null;
	reward: BigNumber;
}
