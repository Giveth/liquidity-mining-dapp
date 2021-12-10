import Head from 'next/head';
import ClaimView from '@/components/views/claim/Claim.view';

export default function GIVdropRoute() {
	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<ClaimView />
		</>
	);
}
