import rateLimit from "express-rate-limit";

// Rate limiter for contact submission to avoid abuse
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 contact requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent from this IP. Please wait 15 minutes before trying again.",
  },
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // Max 300 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
});

