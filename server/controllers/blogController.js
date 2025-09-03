import Blog from "../models/Blog.js";
import User from "../models/user.js";
import Comment from "../models/Comments.js";
import updateEcoPoints from "../utils/ecoPointsHelper.js";
import Notification from "../models/Notification.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, tags, authorName } = req.body;
    const userId = req.user._id;

    // Create the blog
    const blog = new Blog({
      title,
      excerpt,
      content,
      tags,
      authorId: userId,
      authorName:
        authorName || req.user.name || req.user.username || "Anonymous User",
      status: "pending",
    });

    const savedBlog = await blog.save();

    // Update the user document to track this activity
    await User.findByIdAndUpdate(userId, {
      $push: { blogs: blog._id },
    });
    // Award EcoPoints for creating a blog
    try {
      await updateEcoPoints(
        userId,
        "article", // Match the action type in your EcoPoint model
        5, // Points for creating a blog
        `Created blog: ${savedBlog.title}`
      );
    } catch (pointsError) {
      console.error("Error awarding EcoPoints:", pointsError);
      // Continue even if points award fails
    }

    res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs, optionally filter by status
export const getBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user?.isAdmin || req.path.includes("/admin");

    let query = {};

    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }
    // For non-admin users, only show approved blogs by default
    else if (!isAdmin) {
      query.status = "approved";
    }
    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllBlogsForAdmin = async (req, res) => {
  try {
    console.log("Admin requesting blogs");
    const { status } = req.query;

    let query = {};
    if (status) {
      console.log(`Filtering by status: ${status}`);
      query.status = status;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate("authorId", "name username");

    // Log the first few blogs for debugging
    if (blogs.length > 0) {
      console.log("Sample blog:", {
        id: blogs[0]._id,
        title: blogs[0].title,
        status: blogs[0].status,
      });
    }

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs for admin:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get blogs created by the authenticated user
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog
    const blog = await Blog.findById(id)
      .populate("authorId", "username")
      .populate("likes", "username");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Fetch comments separately from the Comment collection
    // No longer need to populate comments.user because we're not using embedded comments

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve blog (admin only)
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    // Update blog status
    blog.status = "approved";
    await blog.save();

    // Create notification for author
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
          message: `"${blog.title}" by ${
            blog.authorName || "a community member"
          } is now available.`,
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

    // Award eco points to the author
    try {
      await updateEcoPoints(
        blog.authorId,
        "publish_blog",
        15, // Points for publishing a blog
        `Blog published: ${blog.title}`
      );
    } catch (ecoPointsError) {
      console.error("Error awarding EcoPoints:", ecoPointsError);
      // Continue even if EcoPoints update fails
    }

    res.json({
      success: true,
      message: "Blog approved and EcoPoints awarded",
      data: blog,
    });
  } catch (error) {
    console.error("Error approving blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject blog (admin only)
export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    blog.status = "rejected";
    await blog.save();

    // Create a notification for the author
    await Notification.create({
      user: blog.authorId,
      title: "Your blog was rejected",
      message: `Your blog “${blog.title}” was rejected. Please review and resubmit.`,
      type: "moderation",
      link: `/blogs/${blog._id}`,
      meta: { blogId: String(blog._id), status: "rejected" },
    });

    res.json({
      success: true,
      message: "Blog rejected",
      data: blog,
    });
  } catch (error) {
    console.error("Error rejecting blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // Verify blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create new comment in separate collection
    const comment = await Comment.create({
      blog: id,
      user: userId,
      content,
    });

    // Populate user info
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username"
    );
    
    try {
      // Get the username of the commenter
      const commenter = await User.findById(userId).select("username").lean();
      const commenterName = commenter?.username || "Someone";

      // Create notification for blog owner
      await Notification.create({
        user: blog.authorId, // Blog owner receives notification
        title: "New Comment on Your Blog",
        message: `${commenterName} commented on your blog "${blog.title.substring(
          0,
          30
        )}${blog.title.length > 30 ? "..." : ""}"`,
        type: "blog",
        link: `/blogs/${blog._id}#comment-${comment._id}`, // Deep link to the specific comment
        meta: {
          blogId: String(blog._id),
          commentId: String(comment._id),
          actionType: "comment",
          actionBy: userId,
        },
      });

      // Also award EcoPoints for commenting if you wish
      try {
        await updateEcoPoints(
          userId,
          "comment_blog", // Using your existing schema action type
          2, // Small points for commenting
          `Commented on blog: ${blog.title}`
        );
      } catch (pointsError) {
        console.error("Error awarding comment EcoPoints:", pointsError);
        // Continue even if points award fails
      }
    } catch (notifyError) {
      console.error("Error sending comment notification:", notifyError);
      // Continue even if notification fails
    }

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments for a blog with pagination
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Get paginated comments
    const comments = await Comment.find({ blog: id })
      .sort({ createdAt: -1 }) // Newest first
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("user", "username");

    // Get total comment count for pagination
    const count = await Comment.countDocuments({ blog: id });

    res.status(200).json({
      success: true,
      data: comments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalComments: count,
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Like a blog
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user already liked the blog
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // Remove the like
      blog.likes = blog.likes.filter(
        (like) => like.toString() !== userId.toString()
      );
    } else {
      // Add the like
      blog.likes.push(userId);
    }

    if (!alreadyLiked) {
      // Only notify on new likes, not unlikes
      try {
        // Get the username of the person who liked
        const liker = await User.findById(userId).select("username").lean();
        const likerName = liker?.username || "Someone";

        // Create notification for the blog owner
        await Notification.create({
          user: blog.authorId, // Blog owner receives notification
          title: "New Like on Your Blog",
          message: `${likerName} liked your blog "${blog.title.substring(
            0,
            30
          )}${blog.title.length > 30 ? "..." : ""}"`,
          type: "blog",
          link: `/blogs/${blog._id}`,
          meta: {
            blogId: String(blog._id),
            actionType: "like",
            actionBy: userId,
          },
        });
      } catch (notifyError) {
        console.error("Error sending like notification:", notifyError);
        // Continue even if notification fails
      }
    }

    await blog.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};
