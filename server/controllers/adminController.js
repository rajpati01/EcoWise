import Campaign from "../models/Campaign.js";
import Blog from "../models/Blog.js";
import User from "../models/user.js";
import Notification from "../models/Notification.js";

// Approve Campaign
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    campaign.status = "approved";
    await campaign.save();

    // Notify the user about the approval
    await Notification.create({
      user: campaign.createdBy,
      title: "Your campaign was approved",
      message: `Your campaign “${campaign.title}” is live now.`,
      type: "moderation",
      link: `/campaigns/${campaign._id}`,
      meta: { campaignId: String(campaign._id), status: "approved" },
    });

    // Broadcast to all users
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
    const inserted = await Notification.insertMany(docs);
    console.log("Broadcasted campaign notifications:", inserted.length);

    res.json({ message: "Campaign approved", campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Campaign
export const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    campaign.status = "rejected";
    await campaign.save();

    // Notify the user about the rejection
    await Notification.create({
      user: campaign.createdBy,
      title: "Your campaign was rejected",
      message: `Your campaign “${campaign.title}” was rejected.`,
      type: "moderation",
      link: `/campaigns/${campaign._id}`,
      meta: { campaignId: String(campaign._id), status: "rejected" },
    });

    res.json({ message: "Campaign rejected", campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// approve blogs
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if already approved to prevent duplicate notifications
    if (blog.status === "approved") {
      return res.json({ message: "Blog already approved", blog });
    }

    blog.status = "approved";
    await blog.save();

    // Notify blog author
    await Notification.create({
      user: blog.authorId,
      title: "Your blog was approved",
      message: `Good news! Your blog "${blog.title}" has been approved.`,
      type: "moderation",
      link: `/blogs/${blog._id}`,
      meta: { blogId: String(blog._id), status: "approved" },
    });

    // Broadcast to all users about new blog
    const usersForBroadcast = await User.find({}, { _id: 1 }).lean();
    if (usersForBroadcast.length) {
      await Notification.insertMany(
        usersForBroadcast.map((u) => ({
          user: u._id,
          title: "New Blog Posted",
          message: `"${blog.title}" is now available.`,
          type: "blog",
          link: `/blogs/${blog._id}`,
          meta: { blogId: String(blog._id) },
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      console.log("Broadcasted blog notifications:", usersForBroadcast.length);
    }

    res.json({ message: "Blog approved", blog });
  } catch (error) {
    console.error("Error approving blog:", error);
    res.status(500).json({ message: error.message });
  }
};

// reject blogs
export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.status = "rejected";
    await blog.save();

    // Notify the user about the rejection
    await Notification.create({
      user: blog.authorId,
      title: "Your blog was rejected",
      message: `Your blog “${blog.title}” was rejected. Please review and resubmit.`,
      type: "moderation",
      link: `/blogs/${blog._id}`,
      meta: { blogId: String(blog._id), status: "rejected" },
    });

    res.json({ message: "Blog rejected", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
