import { getAddress } from 'ethers/lib/utils'
import { constants } from 'ethers'
import { fetchMerkleResults } from './utils'

export const formatAddress = (address: string): string => {
	try {
		return getAddress(address)
	} catch {
		return constants.AddressZero
	}
}

export const fetchClaimData = async (address: string): Promise<any> => {
	try {
		const { claims } = await fetchMerkleResults()
		const formatted = formatAddress(address)

		return claims[formatted]
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e)
		return null
	}
}
