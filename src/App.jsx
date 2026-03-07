import { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Database,
  Download,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Moon,
  Server,
  Sparkles,
  Sun,
} from "lucide-react";

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

const expertise = [
  {
    icon: Code2,
    title: "Frontend Craft",
    text: "React interfaces with clean architecture, smooth motion and responsive layouts.",
  },
  {
    icon: Server,
    title: "Backend Logic",
    text: "Robust APIs, auth flows, and production-ready service integration.",
  },
  {
    icon: Database,
    title: "Data Layer",
    text: "Schema design, indexing, and reliable data pipelines with MongoDB and SQL.",
  },
  {
    icon: Globe,
    title: "Launch Ready",
    text: "SEO basics, performance optimization, and deployment-ready project setups.",
  },
];

const projects = [
  {
    title: "Blogging Website",
    description:
      "A modern blogging platform with post publishing, category filtering, and a clean reading experience.",
    stack: ["React", "Node.js", "MongoDB", "JWT"],
    live: "https://github.com/sonkerlucky5-cmd?tab=repositories",
    code: "https://github.com/sonkerlucky5-cmd",
  },
  {
    title: "E-Commerce Website",
    description:
      "An online shopping website with product listing, cart flow, secure checkout, and order handling.",
    stack: ["React", "Node.js", "MongoDB", "Stripe"],
    live: "https://github.com/sonkerlucky5-cmd?tab=repositories",
    code: "https://github.com/sonkerlucky5-cmd",
  },
  {
    title: "Business Website",
    description:
      "A responsive business website with service sections, lead-focused layout, and polished frontend presentation.",
    stack: ["React", "Vite", "Framer Motion", "CSS3"],
    live: "https://github.com/sonkerlucky5-cmd?tab=repositories",
    code: "https://github.com/sonkerlucky5-cmd",
  },
];

const motionEase = [0.22, 1, 0.36, 1];
const MotionP = motion.p;
const MotionH1 = motion.h1;
const MotionDiv = motion.div;
const MotionArticle = motion.article;
const MotionSpan = motion.span;
const THEME_KEY = "portfolio_theme";
const contactEmail = "sonkerlucky5@gmail.com";
const githubUrl = "https://github.com/sonkerlucky5-cmd";
const linkedinUrl = "https://www.linkedin.com/in/lucky-sonker-24539a2b4";
const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent("Portfolio Inquiry")}`;
const typingLines = [
  "React interfaces that feel smooth.",
  "Node APIs built for real products.",
  "Full-stack work shipped fast.",
];

const sectionStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: motionEase },
  },
};

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [typedText, setTypedText] = useState("");
  const [activeTypingIndex, setActiveTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="page">
      <div className="shape shape-one" />
      <div className="shape shape-two" />

      <header className="topbar">
        <a href="#home" className="brand">
          <Sparkles size={18} />
          <span>Lucky Sonker</span>
        </a>

        <nav className="nav-links">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <a href="#contact" className="btn btn-small">
            Hire Me
          </a>
        </div>
      </header>

      <main>
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
              <a href="/Lucky-cv-1.pdf" target="_blank" rel="noreferrer" className="btn btn-outline">
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
              <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
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

        <section id="about" className="section">
          <MotionDiv
            className="section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="eyebrow">ABOUT</p>
            <h2>Pragmatic development with strong design sense.</h2>
            <p>
              I focus on building products that are fast, usable and easy to
              maintain. From landing pages to full-stack apps, I write clean code
              and ship quickly.
            </p>
          </MotionDiv>

          <div className="about-grid">
            {expertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <MotionArticle
                  key={item.title}
                  className="about-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: motionEase,
                  }}
                  viewport={{ once: true, amount: 0.35 }}
                >
                  <div className="about-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </MotionArticle>
              );
            })}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <MotionDiv
            className="section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="eyebrow">SKILLS</p>
            <h2>Tech stack I use in real projects.</h2>
          </MotionDiv>

          <MotionDiv
            className="skill-cloud"
            variants={sectionStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            {[
              "HTML5",
              "CSS3",
              "JavaScript",
              "React",
              "Next.js",
              "Node.js",
              "Express",
              "MongoDB",
              "PostgreSQL",
              "REST APIs",
              "Git",
              "Framer Motion",
              "Vite",
            ].map((skill) => (
              <MotionSpan
                key={skill}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.04 }}
                transition={{ duration: 0.22, ease: motionEase }}
              >
                {skill}
              </MotionSpan>
            ))}
          </MotionDiv>
        </section>

        <section id="projects" className="section">
          <MotionDiv
            className="section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="eyebrow">PROJECTS</p>
            <h2>Work that blends product thinking with solid engineering.</h2>
          </MotionDiv>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <MotionArticle
                key={project.title}
                className="project-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: motionEase,
                }}
                viewport={{ once: true, amount: 0.28 }}
                whileHover={{ y: -10, scale: 1.015 }}
              >
                <div className="project-head">
                  <Briefcase size={18} />
                  <h3>{project.title}</h3>
                </div>
                <p>{project.description}</p>

                <div className="stack-list">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a href={project.code} target="_blank" rel="noreferrer">
                    Code <Github size={15} />
                  </a>
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live <ExternalLink size={15} />
                  </a>
                </div>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <MotionDiv
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
            whileHover={{ y: -4 }}
          >
            <div className="contact-copy contact-copy-wide">
              <p className="eyebrow">CONTACT</p>
              <h2>Let us build your next project.</h2>
              <p>
                Fastest way to reach me is Gmail. If you have an idea, freelance
                project, or startup concept, send me a direct message there.
              </p>

              <a
                className="btn btn-primary contact-mail"
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Mail size={16} /> {contactEmail}
              </a>
            </div>
          </MotionDiv>
        </section>
      </main>

      <footer className="footer">
        <p>Designed and built by Lucky Sonker</p>
        <p>2026</p>
      </footer>
    </div>
  );
};

export default App;

