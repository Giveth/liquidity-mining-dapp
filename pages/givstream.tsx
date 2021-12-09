import GIVstreamView from '@/components/views/Stream.view';
import Head from 'next/head';

export default function GIVgardenRoute() {
	return (
		<>
			<Head>
				<title>GIVgarden</title>
			</Head>
			<GIVstreamView />
		</>
	);
}
