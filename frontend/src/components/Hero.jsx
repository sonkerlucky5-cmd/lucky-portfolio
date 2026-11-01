import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { WhatsAppIcon, XIcon } from "./BrandIcons";

const MotionP = motion.p;
const MotionH1 = motion.h1;
const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionUl = motion.ul;

const typingLines = [
  "React interfaces that feel smooth.",
  "Node APIs built for real products.",
  "Python models behind clean UIs.",
];

const Hero = ({
  motionEase,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  mailtoUrl,
  resumeUrl,
}) => {
  // Encapsulated typing state to avoid re-rendering the entire app during typing
  const [typedText, setTypedText] = useState("");
  const [activeTypingIndex, setActiveTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = typingLines[activeTypingIndex];
    let timeoutId;

    if (!isDeleting && typedText === currentLine) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 1400);
    } else if (isDeleting && typedText === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setActiveTypingIndex((prev) => (prev + 1) % typingLines.length);
      }, 240);
    } else {
      timeoutId = window.setTimeout(() => {
        const nextLength = typedText.length + (isDeleting ? -1 : 1);
        setTypedText(currentLine.slice(0, nextLength));
      }, isDeleting ? 48 : 88);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeTypingIndex, isDeleting, typedText]);

  return (
    <section id="home" className="section hero">
      <div className="hero-copy">
        <MotionP
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.04, ease: motionEase }}
        >
          FULL STACK DEVELOPER · AI/ML ENGINEER
        </MotionP>

        <MotionP
          className="hero-typing"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: motionEase }}
        >
          <span className="typing-prefix">I build</span>
          <span className="typing-word">{typedText}</span>
          <span className="typing-caret" aria-hidden="true" />
        </MotionP>

        <MotionH1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: motionEase }}
        >
          Full-stack products,{" "}
          <span className="gradient-text">with AI built in.</span>
        </MotionH1>

        <MotionP
          className="hero-text"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: motionEase }}
        >
          I&apos;m <strong>Lucky Sonker</strong> — a full-stack developer who also
          works in Python and machine learning. I build the interface, the API and
          the data model, then layer the intelligence on top.
        </MotionP>

        <MotionDiv
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: motionEase }}
        >
          <a href="#projects" className="btn btn-primary">
            View Projects <ArrowRight size={16} />
          </a>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <Download size={16} />
            Resume
          </a>
        </MotionDiv>

        <MotionUl
          className="hero-stats"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: motionEase }}
        >
          <li>
            <strong>Full Stack</strong>
            <span>React · Node · APIs</span>
          </li>
          <li>
            <strong>Machine Learning</strong>
            <span>Python · Polars · Scikit</span>
          </li>
          <li>
            <strong>E-Commerce</strong>
            <span>Liquid · Shopify · Custom</span>
          </li>
        </MotionUl>

        <MotionDiv
          className="hero-socials"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.36, ease: motionEase }}
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            title="X (Twitter)"
          >
            <XIcon size={16} />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
          <a
            href={mailtoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Email"
            title="Email"
          >
            <Mail size={18} />
          </a>
        </MotionDiv>
      </div>

      <div className="hero-terminal-wrap">
        <div className="hero-terminal">
          <div className="terminal-header">
            <span className="terminal-dot close" />
            <span className="terminal-dot minimize" />
            <span className="terminal-dot expand" />
            <span className="terminal-title">lucky@portfolio:~</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-cmd">
              <span className="prompt">$</span> cat profile.json
            </p>
            <pre className="terminal-output">
{`{
  "name": "Lucky Sonker",
  "role": "Software Engineer",
  "company": "VorldX Industries",
  "database": "PostgreSQL",
  "stack": ["React", "Node", "Python"],
  "status": "Ready for new builds"
}`}
            </pre>
            <p className="terminal-cmd">
              <span className="prompt">$</span> <span className="cursor">_</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
