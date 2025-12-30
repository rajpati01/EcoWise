import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

const CampaignSearchBar = memo(({ searchTerm, onSearchChange, isAuthenticated, onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" role="search">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search campaigns"
        />
      </div>
      {isAuthenticated && (
        <Button className="bg-primary hover:bg-primary/90" onClick={onCreateClick} aria-label="Create new campaign">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Create Campaign
        </Button>
      )}
    </div>
  );
});

export default CampaignSearchBar;
