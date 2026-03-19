const nodemailer = require("nodemailer");

const getEnv = (key) => String(process.env[key] || "").trim();

const getTransportConfig = () => {
  const smtpHost = getEnv("SMTP_HOST");
  const smtpPortRaw = getEnv("SMTP_PORT");
  const smtpUser = getEnv("SMTP_USER");
  const smtpPass = getEnv("SMTP_PASS");

  const missingVars = [];
  if (!smtpHost) missingVars.push("SMTP_HOST");
  if (!smtpPortRaw) missingVars.push("SMTP_PORT");
  if (!smtpUser) missingVars.push("SMTP_USER");
  if (!smtpPass) missingVars.push("SMTP_PASS");

  if (missingVars.length > 0) {
    const configError = new Error(
      `Email service is not configured. Missing: ${missingVars.join(", ")}`
    );
    configError.code = "SMTP_CONFIG_MISSING";
    throw configError;
  }

  if (/^replace_with/i.test(smtpPass)) {
    const configError = new Error(
      "SMTP_PASS is still a placeholder. Set a valid Gmail App Password in backend/.env."
    );
    configError.code = "SMTP_CONFIG_INVALID";
    throw configError;
  }

  const smtpPort = Number.parseInt(smtpPortRaw, 10);
  const isSecureValue = getEnv("SMTP_SECURE").toLowerCase();
  const secure = isSecureValue ? isSecureValue === "true" : smtpPort === 465;

  return {
    host: smtpHost,
    port: Number.isNaN(smtpPort) ? 587 : smtpPort,
    secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  };
};

const sendContactEmail = async ({ name, email, message, id, createdAt }) => {
  const receiverEmail = getEnv("CONTACT_RECEIVER_EMAIL") || getEnv("SMTP_USER");

  if (!receiverEmail) {
    const receiverError = new Error(
      "Email recipient is not configured. Missing: CONTACT_RECEIVER_EMAIL"
    );
    receiverError.code = "SMTP_RECEIVER_MISSING";
    throw receiverError;
  }

  const transportConfig = getTransportConfig();
  const transporter = nodemailer.createTransport(transportConfig);

  const from = getEnv("SMTP_FROM") || getEnv("SMTP_USER");

  try {
    await transporter.sendMail({
      from,
      to: receiverEmail,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: [
        "A new contact form submission was received.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Submitted At: ${createdAt || new Date().toISOString()}`,
        `Message ID: ${id || "N/A"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
  } catch (error) {
    if (error && (error.responseCode === 535 || /invalid login/i.test(error.message))) {
      const authError = new Error(
        "SMTP authentication failed. Set a valid Gmail App Password in backend/.env."
      );
      authError.code = "SMTP_AUTH_FAILED";
      throw authError;
    }

    throw error;
  }
};

module.exports = {
  sendContactEmail,
};
