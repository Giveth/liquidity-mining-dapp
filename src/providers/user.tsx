import { createContext, FC, ReactNode, useState } from 'react'
import { fetchClaimData } from '../helpers/claim'
import { networkProviders } from '../helpers/networkProvider'
import config from '../configuration'
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json'
import { Contract, ethers } from 'ethers'

export interface IUserContext {
	userAddress: string
	claimableAmount: number
	submitUserAddress: (address: string) => void
}
const initialValue = {
	userAddress: '',
	claimableAmount: 0,
	submitUserAddress: () => {},
}
export const Context = createContext<IUserContext>(initialValue)

type Props = {
	children?: ReactNode
}
export const User: FC<Props> = ({ children }) => {
	const [userAddress, setUserAddress] = useState<string>('')
	const [claimableAmount, setClaimableAmount] = useState<number>(0)

	const submitUserAddress = async (address: string) => {
		setUserAddress(address)
		setClaimableAmount(0)

		const claimData = await fetchClaimData(address)
		if (claimData) {
			const provider = networkProviders[config.XDAI_NETWORK_NUMBER]
			console.log('merkle address:', config.XDAI_CONFIG.MERKLE_ADDRESS)
			console.log('abi:', MERKLE_ABI)
			console.log('index:', claimData.index)

			const merkleContract = new Contract(
				config.XDAI_CONFIG.MERKLE_ADDRESS,
				MERKLE_ABI,
				provider,
			)
			console.log(claimData)
			const amount = ethers.BigNumber.from(claimData.amount)
			console.log('amount:', amount.toString())

			try {
				const isClaimedResult = await merkleContract.isClaimed(
					Number(claimData.index),
				)

				console.log('has claimed:', isClaimedResult)
			} catch (e) {
				console.error('error:', e)
			}
		}
	}

	return (
		<Context.Provider
			value={{
				userAddress,
				claimableAmount,
				submitUserAddress,
			}}
		>
			{children}
		</Context.Provider>
	)
}
