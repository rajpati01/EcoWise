const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please add an excerpt"],
      maxlength: [500, "Excerpt cannot be more than 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    coverImage: {
      type: String,
      required: [true, "Please add a cover image"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "waste-management",
        "recycling",
        "sustainability",
        "zero-waste",
        "eco-tips",
        "climate-change",
        "green-technology",
        "circular-economy",
        "environmental-news",
      ],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot be more than 1000 characters"],
        },
        likes: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            likedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            content: {
              type: String,
              required: true,
              maxlength: [500, "Reply cannot be more than 500 characters"],
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        isApproved: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    publishedAt: Date,
    scheduledFor: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
