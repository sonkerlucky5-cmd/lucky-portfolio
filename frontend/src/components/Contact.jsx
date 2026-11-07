import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";
import { sendContactMessage, recordResumeDownload } from "../services/api";

const projectTypes = [
  { id: "fullstack", label: "Full-Stack Web App", emoji: "🚀" },
  { id: "shopify", label: "Shopify Store", emoji: "🛍️" },
  { id: "aiml", label: "AI / ML Pipeline", emoji: "🤖" },
  { id: "hiring", label: "Full-Time Role", emoji: "💼" },
  { id: "chat", label: "Just Saying Hi", emoji: "☕" },
];

const Contact = ({
  motionEase,
  mailtoUrl,
  contactEmail = "sonkerlucky5@gmail.com",
  githubUrl = "https://github.com/sonkerlucky5-cmd",
  linkedinUrl = "https://www.linkedin.com/in/lucky-sonker-24539a2b4",
  twitterUrl = "https://x.com/Lucky_DevAI",
  whatsappUrl = "https://wa.me/919335048020",
  whatsappNumber = "+91 93350 48020",
  resumeUrl = "/Lucky_Sonker_Resume_ATS.pdf",
}) => {
  const [selectedType, setSelectedType] = useState("fullstack");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Full-Stack Web App",
    message: "",
    _gotcha: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmittedId, setLastSubmittedId] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  // Live IST Clock (Lucknow, India)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-IN", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type.id);
    setFormData((prev) => ({
      ...prev,
      subject: type.label,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await sendContactMessage(formData);
      setLastSubmittedId(res?.data?.id || `PG-${Math.floor(1000 + Math.random() * 9000)}`);
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "Full-Stack Web App",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.message || "Failed to deliver message to database. Please reach out via WhatsApp or Email."
      );
    }
  };

  const handleResumeClick = () => {
    recordResumeDownload();
  };

  const whatsappDirectMessage = encodeURIComponent(
    `Hi Lucky! I saw your portfolio and would like to discuss a ${formData.subject || "project"}.`
  );

  return (
    <section id="contact" className="section contact-section-premium">
      <div className="contact-aura-glow" aria-hidden="true" />

      {/* Section Head */}
      <motion.div
        className="section-head text-center contact-header"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: motionEase }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="contact-title">
          Let&apos;s build something <span className="gradient-text">exceptional</span>.
        </h2>
        <p className="contact-subtitle">
          Have an exciting project, full-time role, or freelance requirement? Drop a message below — saved directly into my PostgreSQL database with instant notification.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="contact-premium-grid">
        {/* Left Column: Interactive Form & Topic Picker */}
        <motion.div
          className="contact-card-box form-card-box"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: motionEase }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="card-box-header">
            <div className="card-box-title">
              <Sparkles size={18} className="accent-icon" />
              <h3>Send a Direct Inquiry</h3>
            </div>
            <span className="card-box-tag">Direct PostgreSQL Sync</span>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success-card"
                className="contact-success-showcase"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4 }}
              >
                <div className="success-icon-bubble">
                  <Check size={36} />
                </div>
                <h3>Message Successfully Delivered! 🚀</h3>
                <p>
                  Thank you for reaching out! Your message has been saved in my live PostgreSQL database and forwarded to my email.
                </p>

                <div className="success-meta-bar">
                  <div className="meta-item">
                    <span className="meta-label">STATUS</span>
                    <span className="meta-val text-success">Saved in Database</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">REF ID</span>
                    <span className="meta-val">#{lastSubmittedId}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">AVG RESPONSE</span>
                    <span className="meta-val">&lt; 2 Hours</span>
                  </div>
                </div>

                <div className="success-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStatus("idle")}
                  >
                    <RotateCcw size={15} /> Send Another Message
                  </button>
                  <a
                    className="btn btn-primary"
                    href={`https://wa.me/919335048020?text=${whatsappDirectMessage}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={16} /> Continue on WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <form className="contact-rich-form" onSubmit={handleSubmit}>
                {/* Intent / Topic Selection Pills */}
                <div className="intent-selector-wrap">
                  <label className="input-legend">What are you looking for?</label>
                  <div className="intent-pills">
                    {projectTypes.map((type) => {
                      const isActive = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`intent-pill ${isActive ? "active" : ""}`}
                          onClick={() => handleTypeSelect(type)}
                        >
                          <span className="pill-emoji">{type.emoji}</span>
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Anti-spam honeypot defense (Traps bots, invisible to humans) */}
                <div style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <label htmlFor="contact_gotcha">Do not fill this</label>
                  <input
                    id="contact_gotcha"
                    name="_gotcha"
                    type="text"
                    value={formData._gotcha || ""}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Form Inputs */}
                <div className="form-double-row">
                  <div className="form-field-group">
                    <label htmlFor="contact-name">
                      Your Name <span className="req">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="cool-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="cool-input"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={status === "loading"}
                    className="cool-input"
                  />
                </div>

                <div className="form-field-group form-field-message-group">
                  <div className="textarea-label-row">
                    <label htmlFor="contact-message">
                      Project Details &amp; Message <span className="req">*</span>
                    </label>
                    <span className="char-count">
                      {formData.message.length} / 3000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    maxLength={3000}
                    placeholder="Tell me about your goals, timeline, tech stack, or budget..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === "loading"}
                    className="cool-input cool-textarea"
                  />
                </div>

                {status === "error" && (
                  <motion.div
                    className="form-feedback-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                <div className="form-footer-action-bar">
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn-cool"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <span className="security-guarantee">
                    <Zap size={13} className="text-accent" />
                    Encrypted &amp; Rate-Limited
                  </span>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Dynamic Status & Direct Channels */}
        <motion.div
          className="contact-card-box sidebar-card-box"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: motionEase }}
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Live Status Card */}
          <div className="live-status-card">
            <div className="status-avatar-wrap">
              <picture>
                <source srcSet="/lucky-sonker.webp" type="image/webp" />
                <img
                  src="/lucky-sonker.png"
                  alt="Lucky Sonker"
                  className="status-avatar"
                  width="54"
                  height="54"
                  decoding="async"
                />
              </picture>
              <span className="status-online-beacon" />
            </div>

            <div className="status-info-col">
              <div className="status-role">Ex-SDE · VorldX Industries Private Limited</div>
              <h4 className="status-name">Lucky Sonker</h4>
              <div className="status-location-time">
                <span>
                  <MapPin size={13} /> Lucknow, India
                </span>
                <span>•</span>
                <span>
                  <Clock size={13} /> {currentTime || "IST"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Copy Contact Tiles */}
          <div className="quick-contact-tiles">
            {/* Email Tile */}
            <div className="contact-tile">
              <div className="tile-icon-box mail-box">
                <Mail size={18} />
              </div>
              <div className="tile-text">
                <small>DIRECT EMAIL</small>
                <strong>{contactEmail}</strong>
              </div>
              <div className="tile-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  title="Copy email address"
                  aria-label="Copy email address"
                  onClick={() => handleCopy(contactEmail, "email")}
                >
                  {copiedField === "email" ? (
                    <Check size={14} className="text-success" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <a
                  href={mailtoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-action-btn"
                  title="Open mail application"
                  aria-label="Open mail application"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            {/* WhatsApp Tile */}
            <div className="contact-tile highlight-whatsapp">
              <div className="tile-icon-box whatsapp-box">
                <WhatsAppIcon size={18} />
              </div>
              <div className="tile-text">
                <small>WHATSAPP (FASTEST REPLY)</small>
                <strong>{whatsappNumber}</strong>
              </div>
              <div className="tile-actions">
                <button
                  type="button"
                  className="icon-action-btn"
                  title="Copy phone number"
                  aria-label="Copy phone number"
                  onClick={() => handleCopy(whatsappNumber, "phone")}
                >
                  {copiedField === "phone" ? (
                    <Check size={14} className="text-success" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <a
                  href={`https://wa.me/919335048020?text=${whatsappDirectMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-action-btn"
                  title="Open WhatsApp chat"
                  aria-label="Open WhatsApp chat"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            {/* LinkedIn Tile */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-tile"
            >
              <div className="tile-icon-box linkedin-box">
                <Linkedin size={18} />
              </div>
              <div className="tile-text">
                <small>PROFESSIONAL NETWORK</small>
                <strong>Lucky Sonker on LinkedIn</strong>
              </div>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>

            {/* GitHub Tile */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-tile"
            >
              <div className="tile-icon-box github-box">
                <Github size={18} />
              </div>
              <div className="tile-text">
                <small>CODE &amp; REPOSITORIES</small>
                <strong>sonkerlucky5-cmd</strong>
              </div>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>

            {/* X / Twitter Tile */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-tile"
            >
              <div className="tile-icon-box x-box">
                <XIcon size={16} />
              </div>
              <div className="tile-text">
                <small>X (TWITTER)</small>
                <strong>@Lucky_DevAI</strong>
              </div>
              <ArrowUpRight size={15} className="tile-arrow" />
            </a>
          </div>

          {/* Quick Resume Download Card */}
          <div className="sidebar-resume-banner">
            <div className="resume-banner-content">
              <h4>Need an ATS-ready resume?</h4>
              <p>Updated with MERN, PostgreSQL &amp; AI/ML projects.</p>
            </div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleResumeClick}
              className="btn btn-outline resume-download-btn"
            >
              <Download size={15} /> Download PDF
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
