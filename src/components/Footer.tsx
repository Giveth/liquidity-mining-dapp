import {
	P,
	brandColors,
	Container,
	IconMedium,
	IconGithub,
	IconRedit,
	IconYoutube,
	IconWikipedia,
	IconTwitter,
	Caption,
	Subline,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { Row } from './styled-components/Grid';

export const Footer = () => {
	return (
		<FooterContainer>
			<Container>
				<Row>
					<LeftContainer>
						<LinkColumn>
							<Link href='/' passHref>
								<a>
									<LinkItem>Home</LinkItem>
								</a>
							</Link>
							<a href='https://giveth.io/projects'>
								<LinkItem>Projects</LinkItem>
							</a>
							<a href=''>
								<LinkItem>About Us</LinkItem>
							</a>
							<a href=''>
								<LinkItem>FAQ</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Contanct</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a>
								<LinkItem>Join Our Community</LinkItem>
							</a>
							<a href=''>
								<LinkItem>What is Giveth?</LinkItem>
							</a>
							<a href=''>
								<LinkItem>User Guides</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Developer Docs</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Terms of Use</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a>
								<LinkItem>Giveth TRACE</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Commons Stack</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Partnerships</LinkItem>
							</a>
							<a href=''>
								<LinkItem>We’re Hiring!</LinkItem>
							</a>
						</LinkColumn>
					</LeftContainer>
					<RightContainer>
						<SocialContainer>
							<a href=''>
								<IconMedium
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href=''>
								<IconGithub
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href=''>
								<IconRedit
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href=''>
								<IconTwitter
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href=''>
								<IconYoutube
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href=''>
								<IconWikipedia
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
						</SocialContainer>
						<Row justifyContent='flex-end'>
							<Caption medium>
								Support us with your Donation -
							</Caption>
							<a href=''>
								<CaptionRed medium>
									&nbsp;revolution.eth
								</CaptionRed>
							</a>
						</Row>
						<CopyRights>
							MMXX - No Rights Reserved - The Giveth DAC
						</CopyRights>
					</RightContainer>
				</Row>
			</Container>
		</FooterContainer>
	);
};

const FooterContainer = styled.div`
	background-color: ${brandColors.giv[600]};
	padding: 57px 0 83px;
`;

const LeftContainer = styled(Row)`
	flex: 1;
	justify-content: space-between;
`;

const RightContainer = styled.div`
	flex: 1;
	color: ${brandColors.deep[100]};
`;

const SocialContainer = styled(Row)`
	gap: 40px;
	justify-content: flex-end;
	margin-bottom: 32px;
`;

const LinkColumn = styled(Row)`
	flex-direction: column;
	gap: 8px;
`;

const LinkItem = styled(P)`
	color: ${brandColors.deep[100]};
	cursor: pointer;
`;

const CaptionRed = styled(Caption)`
	color: ${brandColors.pinky[500]};
`;

const CopyRights = styled(Subline)`
	text-align: right;
`;
