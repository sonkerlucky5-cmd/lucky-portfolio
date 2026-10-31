import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
      default: "Portfolio Inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [3000, "Message cannot exceed 3000 characters"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

