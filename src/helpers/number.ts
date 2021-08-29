import BigNumber from 'bignumber.js';

export const Zero = new BigNumber(0);

export const convertEthHelper = (
	amount: BigNumber.Value,
	decimals: number,
	format = true,
) => {
	if (!amount) return '0';
	let amt: BigNumber =
		amount instanceof BigNumber ? amount : new BigNumber(amount);
	if (amt.isZero()) return '0';
	if (format && amt.gt(10 ** 10)) {
		return amt.toExponential(10);
	}
	amt = amt.decimalPlaces(Number(decimals), BigNumber.ROUND_DOWN);
	return format
		? amt.toFormat({
				groupSize: 3,
				groupSeparator: ',',
				decimalSeparator: '.',
		  })
		: amt.toFixed();
};
