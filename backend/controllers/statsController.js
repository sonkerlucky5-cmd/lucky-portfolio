import { Stat } from "../models/Stat.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { isDbConnected } from "../config/db.js";
import {
  getLocalStats,
  incrementLocalStat,
  getLocalMessages,
} from "../data/localStore.js";

export const getStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const visitsDoc = await Stat.findOne({ key: "visits" });
      const resumeDoc = await Stat.findOne({ key: "resumeDownloads" });
      const messageCount = await ContactMessage.countDocuments();

      return res.status(200).json({
        success: true,
        data: {
          visits: visitsDoc ? visitsDoc.value : 0,
          resumeDownloads: resumeDoc ? resumeDoc.value : 0,
          totalMessages: messageCount,
        },
      });
    }

    const localStats = await getLocalStats();
    const localMsgs = await getLocalMessages();
    return res.status(200).json({
      success: true,
      data: {
        visits: localStats.visits || 0,
        resumeDownloads: localStats.resumeDownloads || 0,
        totalMessages: localMsgs.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const recordVisit = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const updated = await Stat.findOneAndUpdate(
        { key: "visits" },
        { $inc: { value: 1 }, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, visits: updated.value });
    }

    const updated = await incrementLocalStat("visits");
    return res.status(200).json({ success: true, visits: updated.visits });
  } catch (error) {
    next(error);
  }
};

export const recordResumeDownload = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const updated = await Stat.findOneAndUpdate(
        { key: "resumeDownloads" },
        { $inc: { value: 1 }, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return res
        .status(200)
        .json({ success: true, resumeDownloads: updated.value });
    }

    const updated = await incrementLocalStat("resumeDownloads");
    return res
      .status(200)
      .json({ success: true, resumeDownloads: updated.resumeDownloads });
  } catch (error) {
    next(error);
  }
};

