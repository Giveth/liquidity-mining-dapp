import Head from 'next/head';
import ClaimView from '@/components/views/claim/Claim.view';
import { Toaster } from 'react-hot-toast';

export default function GIVdropRoute() {
	return (
		<>
			<Head>
				<title>GIVdrop</title>
			</Head>
			<ClaimView />
			<Toaster />
		</>
	);
}
