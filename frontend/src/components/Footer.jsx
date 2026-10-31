import { ArrowUp, Github, Linkedin, Lock, Mail } from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";

const Footer = ({
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  mailtoUrl,
  onOpenAdmin,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <p>
          © {year} Lucky Sonker · Software Engineer
        </p>
        <div className="footer-brand-sub">
          <small>Built with React, PostgreSQL, Express &amp; Vite.</small>
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="footer-admin-link"
              title="Open PostgreSQL Admin Portal (Shortcut: Ctrl + Shift + A)"
            >
              <Lock size={11} />
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      <div className="footer-links">
        <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
          <Github size={16} />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={16} />
        </a>
        <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="X">
          <XIcon size={15} />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={16} />
        </a>
        <a href={mailtoUrl} target="_blank" rel="noreferrer" aria-label="Email">
          <Mail size={16} />
        </a>
        <a href="#home" className="footer-top" aria-label="Back to top">
          Top <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
