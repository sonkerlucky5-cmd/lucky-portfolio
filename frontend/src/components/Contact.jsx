import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";
import { sendContactMessage, recordResumeDownload } from "../services/api";

const MotionDiv = motion.div;

const Contact = ({
  motionEase,
  mailtoUrl,
  contactEmail,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  whatsappNumber,
  resumeUrl,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await sendContactMessage(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.message || "Failed to deliver message. Please try WhatsApp or email."
      );
    }
  };

  const handleResumeClick = () => {
    recordResumeDownload();
  };

  const details = [
    {
      icon: Mail,
      label: "Email",
      value: contactEmail,
      href: mailtoUrl,
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: whatsappNumber,
      href: whatsappUrl,
    },
    {
      icon: XIcon,
      label: "X (Twitter)",
      value: "@Lucky_DevAI",
      href: twitterUrl,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "sonkerlucky5-cmd",
      href: githubUrl,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Lucky Sonker",
      href: linkedinUrl,
    },
  ];

  return (
    <section id="contact" className="section">
      <MotionDiv
        className="contact-card contact-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: motionEase }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -4 }}
      >
        <div className="contact-copy">
          <p className="eyebrow">CONTACT</p>
          <h2>Have a project in mind? Let&apos;s talk.</h2>
          <p>
            I&apos;m open to full-time roles, freelance builds and interesting
            collaborations. Drop a message below or reach out directly on WhatsApp or email.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Full Stack Role / Project Inquiry"
                value={formData.subject}
                onChange={handleChange}
                disabled={status === "loading"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                required
                placeholder="Tell me about your idea, requirement, or timeline..."
                value={formData.message}
                onChange={handleChange}
                disabled={status === "loading"}
              />
            </div>

            {status === "success" && (
              <div className="form-alert form-success">
                <CheckCircle2 size={16} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            {status === "error" && (
              <div className="form-alert form-error">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="contact-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <a
                className="btn btn-outline"
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Mail size={16} /> Send via Mail
              </a>

              <a
                className="btn btn-outline"
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleResumeClick}
              >
                <Download size={16} /> Resume
              </a>
            </div>
          </form>

          <p className="contact-note">
            <span className="status-dot" aria-hidden="true" />
            Usually replies within a day
          </p>
        </div>

        <div className="contact-details">
          {details.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              className="contact-detail"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-detail-icon">
                <Icon size={16} />
              </span>
              <span className="contact-detail-text">
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
              <ArrowUpRight size={15} className="contact-detail-arrow" />
            </a>
          ))}
        </div>
      </MotionDiv>
    </section>
  );
};

export default Contact;
