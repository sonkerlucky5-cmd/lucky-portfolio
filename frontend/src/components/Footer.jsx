import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";

const Footer = ({
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  mailtoUrl,
  onOpenLegal,
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
          <div className="footer-legal-links">
            {onOpenLegal && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenLegal("privacy")}
                  className="footer-policy-link"
                >
                  Privacy Policy
                </button>
                <span className="dot-sep">•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal("terms")}
                  className="footer-policy-link"
                >
                  Terms &amp; Conditions
                </button>
              </>
            )}
          </div>
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
        <a
          href="/"
          className="footer-top"
          aria-label="Back to top"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, "", "/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Top <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
