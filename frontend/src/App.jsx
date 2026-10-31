import { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Download,
  GraduationCap,
  MapPin,
  Network,
  Server,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Projects from "./components/Projects";
import ScrollProgress from "./components/ScrollProgress";
import { getProjects, recordVisit } from "./services/api";

const navItems = ["Home", "About", "Experience", "Skills", "Projects", "Contact"];

const expertise = [
  {
    icon: Code2,
    title: "Full Stack",
    text: "React, Next.js, Node.js, Express and REST APIs shipped to production.",
  },
  {
    icon: BrainCircuit,
    title: "AI / ML",
    text: "Python, NumPy, Pandas, Polars and Scikit-learn on real datasets.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    text: "Shopify themes, Liquid customisation and third-party app integration.",
  },
  {
    icon: Server,
    title: "Currently",
    text: "Software Engineer at VorldX Industries, Lucknow.",
  },
];

const experience = [
  {
    role: "Software Engineer",
    company: "VorldX Industries Pvt. Ltd. · Lucknow",
    period: "Jun 2026 — Present",
    status: "current",
    summary:
      "Building responsive, scalable web applications with the MERN stack, from data model to interface.",
    points: [
      "Develop and maintain production features in React.js, Node.js, Express.js and MongoDB.",
      "Build RESTful APIs and model MongoDB data for efficient reads and writes.",
      "Work with the team on new features, performance tuning and bug fixes, with Git-based code reviews.",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Infoseek Training · Hybrid",
    period: "2025",
    status: "past",
    summary:
      "A three-month intensive MERN programme, delivered as production-style modules.",
    points: [
      "Shipped 4+ full-stack modules covering frontend, backend and database integration.",
      "Engineered 10+ reusable React components, cutting frontend work on new features by roughly 30%.",
      "Designed and tested 15+ REST endpoints in Node.js and Express, backed by MongoDB CRUD.",
    ],
  },
];

const projects = [
  {
    title: "Full Stack E-Commerce Application",
    type: "Full-stack build",
    preview: "ecommerce-app",
    accent: "#da5f36",
    description:
      "A complete production storefront with JWT authentication, product and cart APIs, and an order flow designed for real buyers.",
    points: [
      "Architected secure JWT authentication and 12+ REST API endpoints for products, cart, and orders",
      "Modeled a high-performance MongoDB schema handling 500+ records, cutting page load times by 25%",
      "Engineered responsive React.js UI with smooth state management and checkout integration",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT"],
    code: "https://github.com/sonkerlucky5-cmd",
    live: "",
  },
  {
    title: "Shopify Store Customization",
    type: "E-commerce",
    preview: "shopify-store",
    accent: "#95bf47",
    description:
      "Theme and checkout work for live storefronts — custom sections in Liquid, app integrations and mobile-first polish.",
    points: [
      "Customised 3+ Shopify themes using Liquid, HTML, CSS, and modern JavaScript",
      "Configured 5+ third-party Shopify apps to streamline conversion funnels",
      "Optimized checkout flows and reduced mobile friction points to prevent cart abandonment",
    ],
    stack: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript"],
    code: "https://github.com/sonkerlucky5-cmd",
    live: "",
  },
  {
    title: "AI/ML Analytics Pipeline",
    type: "Data / ML",
    preview: "analytics-pipeline",
    accent: "#7c5cff",
    description:
      "High-throughput Python pipeline that cleans and prepares messy multi-source records, transforming them for scikit-learn statistical analysis and predictions.",
    points: [
      "Automated cleaning and preprocessing pipelines for 5,000+ complex records",
      "Cut manual processing time by 40% utilizing accelerated vector operations in NumPy and Polars",
      "Structured predictive analysis workflows with Pandas and Scikit-learn",
    ],
    stack: ["Python", "NumPy", "Pandas", "Polars", "Scikit-learn"],
    code: "https://github.com/sonkerlucky5-cmd",
    live: "",
  },
  {
    title: "Full-Stack Portfolio & Analytics Platform",
    type: "Full-stack build",
    preview: "portfolio-platform",
    accent: "#0ea5e9",
    description:
      "Personal developer portfolio and visitor analytics engine built with React 19, Node.js, Express, and PostgreSQL with rate-limited inquiry channels.",
    points: [
      "Integrated PostgreSQL relational database with automatic table migrations and data seeding",
      "Built interactive contact inquiry system with anti-spam rate limiting and automated email alerts",
      "Tracked live visitor statistics and ATS resume downloads with sub-100ms API response times",
    ],
    stack: ["React 19", "Node.js", "Express.js", "PostgreSQL", "Framer Motion", "Tailwind CSS"],
    code: "https://github.com/sonkerlucky5-cmd/Portfolio",
    live: "",
  },
];

const skillGroups = [
  {
    Icon: Code2,
    label: "Full Stack",
    note: "Interfaces, APIs and data",
    items: [
      ["HTML5", "html5"], ["CSS3", "css3"], ["JavaScript", "javascript"],
      ["React", "react"], ["Next.js", "nextjs"], ["Node.js", "nodejs"],
      ["Express", "express"], ["MongoDB", "mongodb"], ["PostgreSQL", "postgresql"],
      ["MySQL", "mysql"], ["REST APIs", "rest"], ["Shopify", "shopify", "sf"],
      ["Git", "git"], ["Vite", "vite"],
      ["Framer Motion", "framermotion"],
    ],
  },
  {
    Icon: Database,
    label: "Data & ML",
    note: "Python, data and model tooling",
    items: [
      ["Python", "python"], ["NumPy", "numpy"], ["Pandas", "pandas"],
      ["Polars", "polars", "sf"], ["Matplotlib", "matplotlib"],
      ["Plotly", "plotly"], ["Scikit-learn", "scikitlearn"],
      ["SciPy", "scipy", "sf"], ["TensorFlow", "tensorflow"],
      ["PyTorch", "pytorch"], ["Keras", "keras"], ["OpenCV", "opencv"],
      ["Jupyter", "jupyter"],
    ],
  },
  {
    Icon: BrainCircuit,
    label: "GenAI / LLM",
    note: "Retrieval, agents and LLM apps",
    items: [
      ["LangChain", "langchain", "sf"],
      ["LangGraph", "langgraph", "sf"],
      ["Hugging Face", "huggingface", "sf"],
      ["Ollama", "ollama", "sf"],
      ["LLM APIs", "llm"],
    ],
  },
];

const motionEase = [0.22, 1, 0.36, 1];
const MotionDiv = motion.div;
const MotionArticle = motion.article;
const MotionSpan = motion.span;
const THEME_KEY = "portfolio_theme";
const contactEmail = "sonkerlucky5@gmail.com";
const resumeUrl = "/Lucky_Sonker_Resume_ATS.pdf";
const githubUrl = "https://github.com/sonkerlucky5-cmd";
const linkedinUrl = "https://www.linkedin.com/in/lucky-sonker-24539a2b4";
const twitterUrl = "https://x.com/Lucky_DevAI";
const whatsappNumber = "+91 93350 48020";
const whatsappUrl = "https://wa.me/919335048020";
const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent("Portfolio Inquiry")}`;
const typingLines = [
  "React interfaces that feel smooth.",
  "Node APIs built for real products.",
  "Python models behind clean UIs.",
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
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState(projects);

  useEffect(() => {
    // Record visit on initial load
    recordVisit();

    // Dynamically load projects from backend API
    getProjects().then((backendProjects) => {
      if (backendProjects && backendProjects.length > 0) {
        setProjectList(backendProjects);
      }
    });
  }, []);

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
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <div className="page">
          <ScrollProgress />
          <div className="shape shape-one" />
          <div className="shape shape-two" />
          <div className="shape shape-three" />

          <Navbar navItems={navItems} theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero
          typedText={typedText}
          motionEase={motionEase}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          twitterUrl={twitterUrl}
          whatsappUrl={whatsappUrl}
          mailtoUrl={mailtoUrl}
          resumeUrl={resumeUrl}
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
              <h2>
                A software engineer in Lucknow, building products that hold up in
                production.
              </h2>
              <p className="about-lead">
                I&apos;m Lucky Sonker, a Software Engineer at{" "}
                <strong>VorldX Industries</strong>. My day is React and Node.js —
                interfaces, REST APIs and MongoDB schemas — with Shopify builds and
                Python analytics running alongside it.
              </p>
              <p>
                I like the quietly important part of engineering: shaping the data
                model, making an API predictable, and removing the small frictions
                that make a product feel slow. Lately I&apos;m putting that same
                attention into Python, Polars and machine learning.
              </p>

              <ul className="about-points">
                <li>
                  <Check size={15} aria-hidden="true" />
                  <span>
                    <strong>Full stack</strong> — React, Next.js, Node.js, Express
                    and REST APIs
                  </span>
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  <span>
                    <strong>AI / ML</strong> — Python, NumPy, Pandas, Polars and
                    Scikit-learn
                  </span>
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  <span>
                    <strong>E-commerce</strong> — Shopify themes, Liquid and app
                    integrations
                  </span>
                </li>
              </ul>

              <div className="about-actions">
                <a className="btn btn-primary" href="#contact">
                  Work with me <ArrowRight size={16} />
                </a>
                <a
                  className="btn btn-outline"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={16} /> View resume
                </a>
              </div>
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
                  <span>SOFTWARE ENGINEER · VORLDX</span>
                  <strong>Lucky Sonker</strong>
                  <small>
                    <MapPin size={12} aria-hidden="true" />
                    Lucknow, India
                  </small>
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
                  whileHover={{ y: -5 }}
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

          <div className="about-credentials">
            <MotionArticle
              className="credential-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: motionEase }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="credential-label">
                <GraduationCap size={14} aria-hidden="true" />
                EDUCATION
              </p>
              <h3>Bachelor of Computer Applications</h3>
              <p>Maharishi University of Information Technology, Lucknow</p>
              <span className="credential-meta">2023 — 2026</span>
            </MotionArticle>

            <MotionArticle
              className="credential-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: motionEase }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="credential-label">
                <BadgeCheck size={14} aria-hidden="true" />
                CERTIFICATIONS
              </p>
              <ul className="credential-list">
                <li>
                  JPMorgan Chase &amp; Co. — Software Engineering Job Simulation
                  <span>Forage · Jun 2025</span>
                </li>
                <li>
                  Deloitte — Technology &amp; Data Analytics Simulations
                  <span>Forage · Jun 2025</span>
                </li>
                <li>
                  Deloitte — Cyber Security Job Simulation
                  <span>Forage · Jun 2025</span>
                </li>
                <li>
                  Bootstrap Training — EduPyramids, SINE IIT Bombay
                  <span>Score: 100% · Dec 2025</span>
                </li>
              </ul>
            </MotionArticle>
          </div>
        </section>

        <Experience experience={experience} motionEase={motionEase} />

        <section id="skills" className="section skills-section">
          <MotionDiv
            className="section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="eyebrow">SKILLS</p>
            <h2>Full-stack core. AI/ML and LLM tooling on top.</h2>
            <p>
              The tools behind the day job, plus the Python data stack and the
              GenAI libraries I build with.
            </p>
          </MotionDiv>

          <div className="skill-groups">
            {skillGroups.map(({ Icon: GroupIcon, label, note, items }) => (
              <div className="skill-group" key={label}>
                <MotionDiv
                  className="skill-group-head"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: motionEase }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <h3>
                    <GroupIcon size={16} aria-hidden="true" />
                    {label}
                  </h3>
                  <span>{note}</span>
                </MotionDiv>

                <MotionDiv
                  className="skill-cloud"
                  variants={sectionStagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {items.map(([skill, icon, source]) => (
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
                      ) : icon === "llm" ? (
                        <Sparkles size={44} strokeWidth={1.7} aria-hidden="true" />
                      ) : source === "sf" ? (
                        <span
                          className="tech-mask"
                          style={{
                            "--mask-url": `url("https://cdn.simpleicons.org/${icon}")`,
                          }}
                          aria-hidden="true"
                        />
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
              </div>
            ))}
          </div>
        </section>

        <Projects projects={projectList} motionEase={motionEase} />
        <Contact
          motionEase={motionEase}
          mailtoUrl={mailtoUrl}
          contactEmail={contactEmail}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          twitterUrl={twitterUrl}
          whatsappUrl={whatsappUrl}
          whatsappNumber={whatsappNumber}
          resumeUrl={resumeUrl}
        />
      </main>

        <Footer
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          twitterUrl={twitterUrl}
          whatsappUrl={whatsappUrl}
          mailtoUrl={mailtoUrl}
        />
        </div>
      )}
    </>
  );
};

export default App;
