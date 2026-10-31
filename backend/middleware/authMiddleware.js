import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "lucky_portfolio_secret_key_2026_jwt_token";

export const generateAdminToken = (payload = {}) => {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days validity
  const body = Buffer.from(
    JSON.stringify({ role: "admin", ...payload, exp })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
};

export const verifyAdminToken = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  if (signature !== expectedSignature) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null; // Expired
  }
  return payload;
};

export const requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Admin access token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAdminToken(token);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid or expired admin credentials",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

