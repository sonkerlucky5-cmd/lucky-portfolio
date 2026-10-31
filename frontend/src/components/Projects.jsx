import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Lock, Terminal } from "lucide-react";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const Projects = ({ projects, motionEase }) => {
  return (
    <section id="projects" className="section">
      <MotionDiv
        className="section-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: motionEase }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <p className="eyebrow">SELECTED WORK</p>
        <h2>Projects built end to end.</h2>
        <p>
          Each build covers the data model, the API, and the interface — engineered for scalability and real users.
        </p>
      </MotionDiv>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <MotionArticle
            key={project.id || project.title}
            className="project-card"
            style={{ "--project-accent": project.accent || "var(--accent)" }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: motionEase,
            }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -7 }}
          >
            {/* macOS Browser Header */}
            <div className="project-preview">
              <div className="project-preview-bar" aria-hidden="true">
                <div className="mac-traffic-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-minimize" />
                  <span className="dot dot-expand" />
                </div>
                <div className="project-preview-url">
                  <Lock size={10} className="url-lock-icon" />
                  <span>https://{project.preview}.dev</span>
                </div>
                <div className="project-preview-status">
                  <span className="pulse-indicator" />
                  <span>LIVE</span>
                </div>
              </div>

              {project.image ? (
                <img
                  className="project-preview-image"
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading="lazy"
                />
              ) : (
                <div className="project-preview-body" aria-hidden="true">
                  <div className="preview-top-row">
                    <span className="project-monogram">
                      {project.title.charAt(0)}
                    </span>
                    <div className="preview-code-tag">
                      <Terminal size={11} />
                      <span>v1.0.0 · Production</span>
                    </div>
                  </div>

                  <div className="preview-skeletons">
                    <span className="skeleton skeleton-head" />
                    <span className="skeleton" />
                    <span className="skeleton skeleton-short" />
                  </div>

                  <span className="project-preview-chip">{project.type}</span>
                </div>
              )}
            </div>

            {/* Project Body */}
            <div className="project-body">
              <div className="project-head">
                <h3>{project.title}</h3>
                <span className="project-type-tag">{project.type}</span>
              </div>

              <p className="project-desc">{project.description}</p>

              {/* Bullet Points */}
              <ul className="project-points">
                {project.points &&
                  project.points.slice(0, 3).map((point, pIdx) => (
                    <li key={pIdx}>
                      <span className="point-text">{point}</span>
                    </li>
                  ))}
              </ul>

              {/* Card Footer (Pinned to Bottom for Equal Height) */}
              <div className="project-card-footer">
                <div className="stack-list">
                  {project.stack &&
                    project.stack.slice(0, 5).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  {project.stack && project.stack.length > 5 && (
                    <span className="stack-more">+{project.stack.length - 5}</span>
                  )}
                </div>

                <div className="project-links">
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn project-btn-outline"
                    >
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn project-btn-primary"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <a
                      href={project.code || "https://github.com/sonkerlucky5-cmd"}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn project-btn-primary"
                    >
                      <span>View Repo</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
};

export default Projects;
