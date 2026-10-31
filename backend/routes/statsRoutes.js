import express from "express";
import {
  getStats,
  recordVisit,
  recordResumeDownload,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getStats);
router.post("/visit", recordVisit);
router.post("/resume-download", recordResumeDownload);

export default router;

