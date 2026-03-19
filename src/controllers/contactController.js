const ContactMessage = require("../models/ContactMessage");
const { sendContactEmail } = require("../utils/sendContactEmail");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getDeliveryMessage = (code) => {
  if (
    code === "SMTP_CONFIG_MISSING" ||
    code === "SMTP_CONFIG_INVALID" ||
    code === "SMTP_AUTH_FAILED"
  ) {
    return "Message saved successfully. Email delivery is not configured yet on this system.";
  }

  return "Message saved successfully. Email delivery is temporarily unavailable.";
};

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanMessage = String(message || "").trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res
        .status(400)
        .json({ success: false, message: "name, email and message are required" });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email address" });
    }

    const createdMessage = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    const submittedAt =
      createdMessage.createdAt instanceof Date
        ? createdMessage.createdAt.toISOString()
        : new Date().toISOString();

    let emailDelivered = true;
    let responseMessage = "Message sent successfully";

    try {
      await sendContactEmail({
        id: createdMessage._id,
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
        createdAt: submittedAt,
      });
    } catch (mailError) {
      emailDelivered = false;
      responseMessage = getDeliveryMessage(mailError.code);
      console.error("Contact email delivery failed:", mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: responseMessage,
      data: {
        id: createdMessage._id,
        emailDelivered,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitContactMessage,
};
