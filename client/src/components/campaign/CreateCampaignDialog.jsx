import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const CreateCampaignDialog = memo(({ open, onOpenChange, newCampaign, onInputChange, onSubmit, minStartDate, minEndDate, isSubmitting }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-describedby="new-campaign-description">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" id="new-campaign-description">
          <div>
            <Label htmlFor="title">Campaign Title</Label>
            <Input id="title" name="title" value={newCampaign.title} onChange={onInputChange} placeholder="Beach Cleanup Drive" required aria-required="true" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={newCampaign.description} onChange={onInputChange} placeholder="Join us for a community beach cleanup..." rows={3} required aria-required="true" />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={newCampaign.location} onChange={onInputChange} placeholder="Santa Monica Beach, CA" required aria-required="true" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="datetime-local" value={newCampaign.startDate} onChange={onInputChange} required min={minStartDate} aria-required="true" />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="datetime-local" value={newCampaign.endDate} onChange={onInputChange} required min={minEndDate} aria-required="true" />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full" aria-label={isSubmitting ? "Creating campaign" : "Create campaign"}>
            {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Creating...</>) : ("Create Campaign")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateCampaignDialog;
