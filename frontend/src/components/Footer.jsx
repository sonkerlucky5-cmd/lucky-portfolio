import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";

const Footer = ({
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  mailtoUrl,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <p>
          © {year} Lucky Sonker · Software Engineer
        </p>
        <small>Built with React, Vite and Framer Motion.</small>
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
