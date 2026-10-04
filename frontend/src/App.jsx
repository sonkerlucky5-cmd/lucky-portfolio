import { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import { Code2, Database, Globe, Network, Server } from "lucide-react";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

const expertise = [
  {
    icon: Code2,
    title: "Current Role",
    text: "Software Engineer / SDE",
  },
  {
    icon: Server,
    title: "Company",
    text: "VorldX Industries Pvt. Ltd.",
  },
  {
    icon: Database,
    title: "Focus",
    text: "Full-Stack Development, Python, AI/ML, and Backend Engineering.",
  },
  {
    icon: Globe,
    title: "Previous Experience",
    text: "MERN Stack Engineer Intern — Infoseek",
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

const techSymbols = [
  ["HTML5", "html5"], ["CSS3", "css3"], ["JavaScript", "javascript"],
  ["React", "react"], ["Next.js", "nextjs"], ["Node.js", "nodejs"],
  ["Express", "express"], ["MongoDB", "mongodb"], ["PostgreSQL", "postgresql"],
  ["REST APIs", "rest"], ["Git", "git"], ["Framer Motion", "framermotion"],
  ["Vite", "vite"],
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

      <Navbar navItems={navItems} theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero
          typedText={typedText}
          motionEase={motionEase}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          mailtoUrl={mailtoUrl}
        />

        <section id="about" className="section">
          <div className="about-intro">
          <MotionDiv
            className="section-head about-copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="eyebrow">ABOUT ME</p>
            <h2>About Me</h2>
            <p>
              I&apos;m Lucky Sonker, a results-driven <strong>Software Engineer</strong> currently building scalable web applications at <strong>VorldX Industries</strong>. With expertise across the <strong>MERN stack</strong> and Python-based AI/ML analytics, I specialize in architecting full-stack solutions that drive measurable performance improvements.
            </p>
            <p>
              I thrive on taking complex ideas from architecture to production—whether that means designing secure RESTful APIs, optimizing MongoDB schemas to reduce load times, or engineering reusable React components that streamline frontend development. My experience also extends to crafting custom Shopify e-commerce experiences.
            </p>
            <p>
              Continuously bridging the gap between full-stack architecture and AI/ML capabilities, I am passionate about leveraging robust system design, automation, and problem-solving to build reliable, high-impact digital products.
            </p>
          </MotionDiv>

          <MotionDiv
            className="about-photo-wrap"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.65, ease: motionEase }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <figure className="about-photo">
              <img src="/lucky%20sonker.png" alt="Lucky Sonker" loading="lazy" />
              <figcaption>
                <span>SOFTWARE ENGINEER</span>
                <strong>Lucky Sonker</strong>
              </figcaption>
            </figure>
          </MotionDiv>
          </div>

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
            {techSymbols.map(([skill, icon]) => (
              <MotionSpan
                key={skill}
                className={`tech-symbol tech-symbol-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                role="img"
                aria-label={skill}
                title={skill}
                variants={fadeUp}
                whileHover={{ y: -9, scale: 1.08, rotateX: 8, rotateY: -8 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                style={{ transformPerspective: 700 }}
              >
                {icon === "rest" ? (
                  <Network size={44} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${icon}/${icon}-original.svg`}
                    alt=""
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                )}
              </MotionSpan>
            ))}
          </MotionDiv>
        </section>

        <Projects projects={projects} motionEase={motionEase} />
        <Contact
          motionEase={motionEase}
          mailtoUrl={mailtoUrl}
          contactEmail={contactEmail}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
