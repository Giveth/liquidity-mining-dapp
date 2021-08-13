import React from "react";
import ClaimCard from "../../cards/Claim";
import { ConnectCard } from "../../cards/Connect";
import { DonateCard } from "../../cards/Donate";
import GovernCard from "../../cards/Govern"; "../../cards/Govern";
import InvestCard from "../../cards/Invest";

const ClaimCarousel = () => {
    return <div>
        <ConnectCard />
        <InvestCard />
        <GovernCard />
        <DonateCard />
        <ClaimCard />
    </div>
};

export default ClaimCarousel;