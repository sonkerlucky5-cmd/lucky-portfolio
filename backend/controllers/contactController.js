import { query, isDbConnected } from "../config/db.js";
import {
  saveLocalMessage,
  getLocalMessages,
  markLocalMessageRead,
  deleteLocalMessage,
} from "../data/localStore.js";
import { sendNotificationEmail } from "../utils/emailService.js";

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "Portfolio Inquiry").trim(),
      message: message.trim(),
      ipAddress,
    };

    let savedMessage;

    if (isDbConnected()) {
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
      savedMessage = result.rows[0];
    } else {
      savedMessage = await saveLocalMessage(payload);
    }

    // Send async email notification (won't block user response)
    sendNotificationEmail(payload).catch((err) =>
      console.warn("Async email failed:", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been received.",
      data: {
        id: savedMessage.id || savedMessage._id,
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
    let messages;
    if (isDbConnected()) {
      const sql = `
        SELECT id, name, email, subject, message, status, ip_address AS "ipAddress",
               created_at AS "createdAt", updated_at AS "updatedAt"
        FROM contact_messages
        ORDER BY created_at DESC;
      `;
      const result = await query(sql);
      messages = result.rows;
    } else {
      messages = await getLocalMessages();
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
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
    } else {
      const msg = await markLocalMessageRead(id);
      if (!msg) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      return res.status(200).json({ success: true, data: msg });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
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
    } else {
      const deleted = await deleteLocalMessage(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Message deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};
