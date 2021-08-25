import Head from 'next/head'
import ClaimView from '../src/components/views/claim/Claim.view'

export default function HomeRoute() {
	return (
		<>
			<Head>
				<title>Claim Giv Drop</title>
			</Head>
			<ClaimView />
		</>
	)
}
