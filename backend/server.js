import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, isDbConnected } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers Middleware (OWASP recommended)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:5000 http://localhost:5173 https:; frame-ancestors 'none';"
  );
  next();
});

// Enable CORS with restricted origin policy
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://luckysanker.dev",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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
    database: isDbConnected() ? "connected (PostgreSQL)" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API is running with PostgreSQL",
    database: isDbConnected() ? "PostgreSQL Connected" : "Disconnected",
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

// Connect PostgreSQL and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
    console.log(`📡 Database: ${isDbConnected() ? "PostgreSQL Connected" : "PostgreSQL Offline"}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
};

startServer();
