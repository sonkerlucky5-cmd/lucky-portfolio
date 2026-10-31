import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Project type is required"],
      trim: true,
    },
    preview: {
      type: String,
      default: "project-preview",
    },
    accent: {
      type: String,
      default: "#da5f36",
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    points: {
      type: [String],
      default: [],
    },
    stack: {
      type: [String],
      default: [],
    },
    code: {
      type: String,
      default: "",
    },
    live: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);

