import { Project } from "../models/Project.js";
import { isDbConnected } from "../config/db.js";
import {
  getLocalProjects,
  addLocalProject,
} from "../data/localStore.js";
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };

export const getAllProjects = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let projects = await Project.find().sort({ createdAt: -1 });
      if (projects.length === 0) {
        // Seed default projects if DB is empty
        projects = await Project.insertMany(
          defaultProjects.map(({ id, ...p }) => p)
        );
      }
      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    }

    const projects = await getLocalProjects();
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.length > 0 ? projects : defaultProjects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const project = await Project.findById(id);
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, data: project });
    }

    const projects = await getLocalProjects();
    const project = projects.find((p) => p._id === id || p.id === id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, type, preview, accent, description, points, stack, code, live } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const payload = {
      title,
      type: type || "Full-stack build",
      preview: preview || "project-preview",
      accent: accent || "#da5f36",
      description,
      points: Array.isArray(points) ? points : [],
      stack: Array.isArray(stack) ? stack : [],
      code: code || "",
      live: live || "",
    };

    if (isDbConnected()) {
      const created = await Project.create(payload);
      return res.status(201).json({ success: true, data: created });
    }

    const created = await addLocalProject(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

