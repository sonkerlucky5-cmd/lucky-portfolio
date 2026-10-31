import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, isDbConnected } from "./config/db.js";
import { initLocalStore } from "./data/localStore.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// General Rate Limiter
app.use("/api/", apiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? "connected (MongoDB)" : "active (local store fallback)",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/info", infoRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API is running",
    endpoints: {
      health: "/api/health",
      contact: "/api/contact",
      projects: "/api/projects",
      stats: "/api/stats",
      info: "/api/info",
    },
  });
});

// 404 & Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB / local store and start server
const startServer = async () => {
  await initLocalStore();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
};

startServer();

