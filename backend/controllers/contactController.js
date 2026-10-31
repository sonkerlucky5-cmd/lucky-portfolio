import { query } from "../config/db.js";
import { sendNotificationEmail } from "../utils/emailService.js";

// Sanitize string against XSS and strip HTML tags
const sanitizeText = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "'": return "&#39;";
        case '"': return "&quot;";
        case "&": return "&amp;";
        default: return char;
      }
    })
    .trim();
};

// Privacy Engineering: Anonymize IP to comply with data minimization
const anonymizeIpAddress = (ip) => {
  if (!ip) return "anonymized";
  const clean = ip.replace(/^.*:/, ""); // Strip IPv6 prefix if present
  if (clean.includes(".")) {
    const parts = clean.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  return "anonymized";
};

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message, _gotcha } = req.body;

    // Honeypot spam defense: if hidden field is filled, silently drop bot submission
    if (_gotcha) {
      return res.status(201).json({
        success: true,
        message: "Thank you for reaching out! Your message has been received.",
        data: {
          id: `SPAM-${Date.now()}`,
          name: "User",
          createdAt: new Date().toISOString(),
        },
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message.",
      });
    }

    // Strict boundary checks
    if (name.length > 100 || email.length > 120 || (subject && subject.length > 150) || message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Input length exceeds security limit.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const rawIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const payload = {
      name: sanitizeText(name),
      email: email.trim().toLowerCase(),
      subject: sanitizeText(subject || "Portfolio Inquiry"),
      message: sanitizeText(message),
      ipAddress: anonymizeIpAddress(rawIp),
    };

    const sql = `
      INSERT INTO contact_messages (name, email, subject, message, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, subject, message, status, created_at AS "createdAt";
    `;
    const result = await query(sql, [
      payload.name,
      payload.email,
      payload.subject,
      payload.message,
      payload.ipAddress,
    ]);
    const savedMessage = result.rows[0];

    // Send async email notification
    sendNotificationEmail(payload).catch((err) =>
      console.warn("Async email failed:", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been received.",
      data: {
        id: savedMessage.id,
        name: savedMessage.name,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const sql = `
      SELECT id, name, email, subject, message, status, ip_address AS "ipAddress",
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM contact_messages
      ORDER BY created_at DESC;
    `;
    const result = await query(sql);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE contact_messages
      SET status = 'read', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, subject, message, status, created_at AS "createdAt", updated_at AS "updatedAt";
    `;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM contact_messages WHERE id = $1 RETURNING id;`;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};
