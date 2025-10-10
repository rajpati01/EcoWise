import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "alert",
        "certificate",
        "blog",
        "campaign",
        "moderation",
      ],
      default: "info",
    },
    link: { type: String, default: null }, // e.g., deep-link to blog/campaign/certificate download
    read: { type: Boolean, default: false },
    meta: { type: Object, default: {} }, // optional extra data (ids, etc.)
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
