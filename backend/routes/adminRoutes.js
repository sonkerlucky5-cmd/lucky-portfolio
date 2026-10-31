import express from "express";
import {
  adminLogin,
  getAdminOverview,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUpdateProfile,
} from "../controllers/adminController.js";
import {
  getContactMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/contactController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Admin Login
router.post("/login", adminLogin);

// Protected Admin Routes (Requires Bearer token)
router.use(requireAdminAuth);

// Overview
router.get("/overview", getAdminOverview);

// Project Management
router.get("/projects", adminGetProjects);
router.post("/projects", adminCreateProject);
router.put("/projects/:id", adminUpdateProject);
router.delete("/projects/:id", adminDeleteProject);

// Contact Messages Management
router.get("/messages", getContactMessages);
router.patch("/messages/:id/read", markMessageRead);
router.delete("/messages/:id", deleteMessage);

// Profile & Website Info Management
router.put("/profile", adminUpdateProfile);

export default router;

