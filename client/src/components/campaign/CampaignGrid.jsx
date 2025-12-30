import { memo } from "react";
import CampaignCard from "./CampaignCard";

const CampaignGrid = memo(({ campaigns }) => {
  if (!campaigns || campaigns.length === 0) return null;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign._id} campaign={campaign} />
      ))}
    </div>
  );
});

export default CampaignGrid;
