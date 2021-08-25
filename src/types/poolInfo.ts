import BigNumber from 'bignumber.js'

export interface Earned {
	amount: BigNumber
	token: string
	displayToken: string
}
export interface StakeUserInfo {
	stakedLpTokens?: BigNumber | number
	notStakedLpTokensWei?: BigNumber | number
	earned?: Earned
}
export interface StakePoolInfo extends StakeUserInfo {
	tokensInPool?: BigNumber | number
	tokensInPoolUSD?: BigNumber | number
	APR?: BigNumber | null
	reserves?: Array<BigNumber>
	poolTotalSupply?: BigNumber
}

export interface PoolInfo {
	name?: string
	provideLiquidity?: string
	composition?: string
	stakePoolInfo?: StakePoolInfo
}
