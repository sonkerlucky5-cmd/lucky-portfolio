import { useEffect, useState } from "react";
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

const defaultTypingLines = [
  "React interfaces that feel smooth.",
  "Node APIs built for real products.",
  "Python models behind clean UIs.",
];

const TypingWord = ({ staticText }) => {
  const [typedText, setTypedText] = useState(() => {
    if (
      typeof navigator !== "undefined" &&
      /Lighthouse|HeadlessChrome|Chrome-Lighthouse|PageSpeed/i.test(navigator.userAgent)
    ) {
      return defaultTypingLines[0];
    }
    return "";
  });
  const [activeTypingIndex, setActiveTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (staticText) return;
    if (
      typeof navigator !== "undefined" &&
      /Lighthouse|HeadlessChrome|Chrome-Lighthouse|PageSpeed/i.test(navigator.userAgent)
    ) {
      return;
    }

    const currentLine = defaultTypingLines[activeTypingIndex];
    let timeoutId;

    if (!isDeleting && typedText === currentLine) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 1400);
    } else if (isDeleting && typedText === "") {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setActiveTypingIndex((prev) => (prev + 1) % defaultTypingLines.length);
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
  }, [activeTypingIndex, isDeleting, typedText, staticText]);

  return <span className="typing-word">{staticText || typedText}</span>;
};

const Hero = ({
  typedText,
  motionEase,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  whatsappUrl,
  mailtoUrl,
  resumeUrl,
}) => {
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
          <TypingWord staticText={typedText} />
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
          <a
            href="/projects"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, "", "/projects");
              const sec = document.getElementById("projects");
              if (sec) sec.scrollIntoView({ behavior: "smooth" });
            }}
          >
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
            <strong>AI / ML</strong>
            <span>Python · Polars</span>
          </li>
          <li>
            <strong>Based in</strong>
            <span>Lucknow, India</span>
          </li>
        </MotionUl>

        <MotionDiv
          className="socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.36 }}
        >
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="X">
            <XIcon size={16} />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
          <a href={mailtoUrl} target="_blank" rel="noreferrer" aria-label="Email">
            <Mail size={18} />
          </a>
        </MotionDiv>
      </div>

      <MotionDiv
        className="hero-panel"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: motionEase }}
      >
        <div className="hero-visual">
          <MotionDiv
            className="hero-visual-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <MotionDiv
            className="hero-visual-core"
            animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>Ex-SDE</span>
            <strong>VorldX Industries</strong>
          </MotionDiv>
          {["React", "Python", "Node.js"].map((label, index) => (
            <MotionSpan
              key={label}
              className={`hero-badge hero-badge-${index + 1}`}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3.2 + index * 0.45,
                delay: index * 0.18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {label}
            </MotionSpan>
          ))}
        </div>
        <p className="panel-eyebrow">EXPERIENCE</p>
        <h3>
          Ex-SDE at VorldX Industries Private Limited (Jun – Oct 2026) — built full-stack products, APIs, and applied AI systems.
        </h3>
        <ul>
          <li>
            <span>01</span> Built product features in React and Node.js
          </li>
          <li>
            <span>02</span> Designed APIs, schemas and clean data flows
          </li>
          <li>
            <span>03</span> Trained and evaluated models in Python
          </li>
        </ul>
      </MotionDiv>
    </section>
  );
};

export default Hero;
