import Campaign from "../models/Campaign.js";
import User from "../models/user.js";
import Notification from "../models/Notification.js";
import updateEcoPoints from "../utils/ecoPointsHelper.js";

export const createCampaign = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate } = req.body;

    if (!title || !description || !location || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const campaign = new Campaign({
      title,
      description,
      location,
      startDate,
      endDate,
      createdBy: req.user._id,
      status: "pending",
    });

    await campaign.save();

    // Notify creator that campaign has been submitted for approval
    try {
      await Notification.create({
        user: req.user._id,
        title: "Campaign Submitted for Approval",
        message: `Your campaign "${campaign.title}" has been submitted for approval.`,
        type: "moderation",
        link: `/campaigns/${campaign._id}`,
        meta: { campaignId: String(campaign._id), status: "pending" },
      });
    } catch (notifyErr) {
      // Notification failing is non-fatal for creation
      console.error("Failed to create submission notification:", notifyErr);
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Campaign creation failed:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create campaign" });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("createdBy", "username")
      .sort({ date: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

// Fetch campaigns created by the user
export const getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user._id });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// For joining a campaign
export const joinCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    console.log("Joining campaign:", campaignId, "for user:", userId);

    // First update the user document - add to campaigns array
    const updateResult = await User.updateOne(
      { _id: userId },
      {
        $set: {
          campaigns: [
            {
              campaign: campaignId,
              joinedAt: new Date(),
              status: "active",
            },
          ],
        },
      }
    );

    console.log("Update result:", updateResult);

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    // Check if participants exists and is an array
    if (!campaign.participants || !Array.isArray(campaign.participants)) {
      campaign.participants = [];
    }

    // Check if user is already a participant
    let alreadyJoined = false;

    // Check existing participants
    for (let i = 0; i < campaign.participants.length; i++) {
      const participant = campaign.participants[i];

      // Check if participant has valid structure
      if (!participant.user) {
        // Fix invalid participant by removing it
        console.log(`Fixing invalid participant at index ${i}`);
        campaign.participants.splice(i, 1);
        i--; // Adjust index since we removed an element
        continue;
      }

      // Check if user already joined
      const participantId = participant.user.toString();
      if (participantId === userId) {
        alreadyJoined = true;
        break;
      }
    }

    if (alreadyJoined) {
      console.log("User already joined this campaign");
      return res.status(400).json({ message: "Already joined" });
    }

    // Add user to participants with current date
    campaign.participants.push({
      user: req.user._id,
      joinedAt: new Date(),
    });

    await campaign.save();

    // Add EcoPoints (3 points for joining)
    try {
      await updateEcoPoints(
        req.user._id,
        "join_campaign",
        3,
        `Joined campaign: ${campaign.title}`
      );
    } catch (ecoPointsError) {
      console.error("Error awarding EcoPoints (non-critical):", ecoPointsError);
      // Continue even if EcoPoints update fails
    }

    return res.json({
      success: true,
      message: "Joined campaign successfully",
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        participantCount: campaign.participants.length,
      },
    });
  } catch (err) {
    console.error("Error joining campaign:", err);
    res.status(500).json({
      message: "Error joining campaign",
      error: err.message || "Unknown error",
    });
  }
};

// Fetch campaigns where user is a participant
export const getJoinedCampaigns = async (req, res) => {
  try {
    // Find campaigns where user is a participant
    const campaigns = await Campaign.find({
      "participants.user": req.user._id,
    })
      .populate("createdBy", "username")
      .sort({ startDate: -1 });
    return res.json(campaigns || []);
  } catch (err) {
    console.error("Error fetching joined campaigns:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch joined campaigns" });
  }
};

// Admin-only
export const updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const campaignId = req.params.id;

    // Fetch campaign so we know previous status
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const prevStatus = campaign.status;
    campaign.status = status;
    await campaign.save();

    // If approved and previously not approved -> award eco points + custom notification
    if (status === "approved" && prevStatus !== "approved") {
      try {
        // Award eco points (10 points for campaign creation on approval)
        await updateEcoPoints(
          campaign.createdBy,
          "campaign",
          10,
          `Approved campaign: ${campaign.title}`
        );

        // Notify creator about approval + eco points
        await Notification.create({
          user: campaign.createdBy,
          title: "Campaign Approved — EcoPoints Awarded",
          message: `Your campaign "${campaign.title}" was approved and you've received 10 EcoPoints.`,
          type: "moderation",
          link: `/campaigns/${campaign._id}`,
          meta: { campaignId: String(campaign._id), status: "approved", ecoPoints: 10 },
        });

        // Broadcast to all users that a new campaign launched
        const users = await User.find({}, { _id: 1 }).lean();
        const docs = users.map((u) => ({
          user: u._id,
          title: "New Campaign Launched",
          message: `Join our new campaign: “${campaign.title}”.`,
          type: "campaign",
          link: `/campaigns/${campaign._id}`,
          meta: { campaignId: String(campaign._id) },
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        if (docs.length) {
          await Notification.insertMany(docs);
        }
      } catch (err) {
        console.error("Error awarding eco points or sending notifications in updateCampaignStatus:", err);
        // Do not fail the status update because of notification/points errors
      }
    } else if (status === "approved" && prevStatus === "approved") {
      // Already approved: ensure we still send a campaign broadcast if desired, but avoid awarding points
      try {
        const users = await User.find({}, { _id: 1 }).lean();
        const docs = users.map((u) => ({
          user: u._id,
          title: "New Campaign Launched",
          message: `Join our new campaign: “${campaign.title}”.`,
          type: "campaign",
          link: `/campaigns/${campaign._id}`,
          meta: { campaignId: String(campaign._id) },
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        if (docs.length) {
          await Notification.insertMany(docs);
        }
      } catch (err) {
        console.error("Error broadcasting campaign notifications for already-approved campaign:", err);
      }
    } else if (status === "rejected") {
      try {
        await Notification.create({
          user: campaign.createdBy,
          title: "Campaign Rejected",
          message: `Your campaign "${campaign.title}" was rejected by the admin.`,
          type: "moderation",
          link: `/campaigns/${campaign._id}`,
          meta: { campaignId: String(campaign._id), status: "rejected" },
        });
      } catch (notifyErr) {
        console.error("Failed to create rejection notification:", notifyErr);
      }
    }

    res.json(campaign);
  } catch (err) {
    console.error("Error updating campaign status:", err);
    res.status(500).json({ message: "Error updating campaign status" });
  }
};