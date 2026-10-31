import { ContactMessage } from "../models/ContactMessage.js";
import { isDbConnected } from "../config/db.js";
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
      savedMessage = await ContactMessage.create(payload);
    } else {
      savedMessage = await saveLocalMessage(payload);
    }

    // Try sending email notification (async, won't block user response)
    sendNotificationEmail(payload).catch((err) =>
      console.warn("Async email failed:", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been received.",
      data: {
        id: savedMessage._id,
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
      messages = await ContactMessage.find().sort({ createdAt: -1 });
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
      const msg = await ContactMessage.findByIdAndUpdate(
        id,
        { status: "read" },
        { new: true }
      );
      if (!msg) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      return res.status(200).json({ success: true, data: msg });
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
      const deleted = await ContactMessage.findByIdAndDelete(id);
      if (!deleted) {
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

