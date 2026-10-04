import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const MotionP = motion.p;
const MotionH1 = motion.h1;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

const Hero = ({
  typedText,
  motionEase,
  githubUrl,
  linkedinUrl,
  mailtoUrl,
}) => {
  return (
    <section id="home" className="section hero">
      <div className="hero-copy">
        <MotionP
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: motionEase }}
        >
          FULL STACK DEVELOPER
        </MotionP>

        <MotionP
          className="hero-typing"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04, ease: motionEase }}
        >
          <span className="typing-prefix">I build</span>
          <span className="typing-word">{typedText}</span>
          <span className="typing-caret" aria-hidden="true" />
        </MotionP>

        <MotionH1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: motionEase }}
        >
          Building websites that feel fast, clear, and memorable.
        </MotionH1>

        <MotionP
          className="hero-text"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: motionEase }}
        >
          Hi, I am <strong>Lucky Sonker</strong>. I build modern web products with
          React and Node.js, focused on clean UX and practical business value.
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
            href="/Lucky-cv-1.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <Download size={16} />
            Resume
          </a>
        </MotionDiv>

        <MotionDiv
          className="socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.34 }}
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
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <MotionDiv
            className="hero-visual-core"
            animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>Ship Fast</span>
            <strong>Design + Code</strong>
          </MotionDiv>
          {["Motion", "API Ready", "Responsive"].map((label, index) => (
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
        <p className="panel-eyebrow">CURRENT FOCUS</p>
        <h3>Designing high-performance portfolio and business sites.</h3>
        <ul>
          <li>
            <span>01</span> Responsive experiences for mobile and desktop
          </li>
          <li>
            <span>02</span> Interactive UI with lightweight animations
          </li>
          <li>
            <span>03</span> API integrations and scalable backend structure
          </li>
        </ul>
      </MotionDiv>
    </section>
  );
};

export default Hero;
