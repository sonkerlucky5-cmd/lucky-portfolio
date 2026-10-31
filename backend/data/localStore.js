import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGES_FILE = path.join(__dirname, "messages.json");
const PROJECTS_FILE = path.join(__dirname, "projects.json");
const STATS_FILE = path.join(__dirname, "stats.json");
const DEFAULT_PROJECTS_FILE = path.join(__dirname, "defaultProjects.json");

// Helper to safely read JSON
const readJson = async (filePath, defaultValue = []) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
};

// Helper to safely write JSON
const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

// Initialize projects if not existing
export const initLocalStore = async () => {
  try {
    const projects = await readJson(PROJECTS_FILE, null);
    if (!projects) {
      const defaultProjects = await readJson(DEFAULT_PROJECTS_FILE, []);
      await writeJson(PROJECTS_FILE, defaultProjects);
    }
    await readJson(MESSAGES_FILE, []);
    await readJson(STATS_FILE, { visits: 0, resumeDownloads: 0 });
  } catch (err) {
    console.error("Local store init error:", err.message);
  }
};

// --- Contact Messages ---
export const saveLocalMessage = async (msgData) => {
  const messages = await readJson(MESSAGES_FILE, []);
  const newMsg = {
    _id: "local_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    ...msgData,
    status: "unread",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  messages.unshift(newMsg);
  await writeJson(MESSAGES_FILE, messages);
  return newMsg;
};

export const getLocalMessages = async () => {
  return await readJson(MESSAGES_FILE, []);
};

export const markLocalMessageRead = async (id) => {
  const messages = await readJson(MESSAGES_FILE, []);
  const msg = messages.find((m) => m._id === id);
  if (msg) {
    msg.status = "read";
    msg.updatedAt = new Date().toISOString();
    await writeJson(MESSAGES_FILE, messages);
    return msg;
  }
  return null;
};

export const deleteLocalMessage = async (id) => {
  const messages = await readJson(MESSAGES_FILE, []);
  const filtered = messages.filter((m) => m._id !== id);
  await writeJson(MESSAGES_FILE, filtered);
  return filtered.length !== messages.length;
};

// --- Projects ---
export const getLocalProjects = async () => {
  return await readJson(PROJECTS_FILE, []);
};

export const addLocalProject = async (projectData) => {
  const projects = await readJson(PROJECTS_FILE, []);
  const newProj = {
    _id: "proj_" + Date.now(),
    ...projectData,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProj);
  await writeJson(PROJECTS_FILE, projects);
  return newProj;
};

// --- Stats ---
export const getLocalStats = async () => {
  return await readJson(STATS_FILE, { visits: 0, resumeDownloads: 0 });
};

export const incrementLocalStat = async (statKey) => {
  const stats = await readJson(STATS_FILE, { visits: 0, resumeDownloads: 0 });
  stats[statKey] = (stats[statKey] || 0) + 1;
  stats.lastUpdated = new Date().toISOString();
  await writeJson(STATS_FILE, stats);
  return stats;
};

