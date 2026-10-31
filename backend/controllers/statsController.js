import { query, isDbConnected } from "../config/db.js";
import {
  getLocalStats,
  incrementLocalStat,
  getLocalMessages,
} from "../data/localStore.js";

export const getStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const statsRes = await query("SELECT key, value FROM stats;");
      const countRes = await query("SELECT COUNT(*) FROM contact_messages;");

      const statsMap = {};
      statsRes.rows.forEach((row) => {
        statsMap[row.key] = row.value;
      });

      return res.status(200).json({
        success: true,
        data: {
          visits: statsMap.visits || 0,
          resumeDownloads: statsMap.resumeDownloads || 0,
          totalMessages: parseInt(countRes.rows[0].count, 10),
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
      const sql = `
        INSERT INTO stats (key, value, last_updated)
        VALUES ('visits', 1, CURRENT_TIMESTAMP)
        ON CONFLICT (key)
        DO UPDATE SET value = stats.value + 1, last_updated = CURRENT_TIMESTAMP
        RETURNING value;
      `;
      const result = await query(sql);
      return res.status(200).json({ success: true, visits: result.rows[0].value });
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
      const sql = `
        INSERT INTO stats (key, value, last_updated)
        VALUES ('resumeDownloads', 1, CURRENT_TIMESTAMP)
        ON CONFLICT (key)
        DO UPDATE SET value = stats.value + 1, last_updated = CURRENT_TIMESTAMP
        RETURNING value;
      `;
      const result = await query(sql);
      return res
        .status(200)
        .json({ success: true, resumeDownloads: result.rows[0].value });
    }

    const updated = await incrementLocalStat("resumeDownloads");
    return res
      .status(200)
      .json({ success: true, resumeDownloads: updated.resumeDownloads });
  } catch (error) {
    next(error);
  }
};
