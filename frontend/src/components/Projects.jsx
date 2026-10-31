import { motion } from "framer-motion";
import { ExternalLink, Github, Lock } from "lucide-react";

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
          Each build covers the data model, the API and the interface — not just
          the screen.
        </p>
      </MotionDiv>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <MotionArticle
            key={project.title}
            className="project-card"
            style={{ "--project-accent": project.accent }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: motionEase,
            }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8 }}
          >
            <div className="project-preview">
              <div className="project-preview-bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span className="project-preview-url">
                  <Lock size={10} />
                  {project.preview}
                </span>
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
                  <span className="project-monogram">
                    {project.title.charAt(0)}
                  </span>
                  <span className="skeleton skeleton-head" />
                  <span className="skeleton" />
                  <span className="skeleton skeleton-short" />
                  <span className="project-preview-chip">{project.type}</span>
                </div>
              )}
            </div>

            <div className="project-body">
              <div className="project-head">
                <h3>{project.title}</h3>
                <span className="project-type">{project.type}</span>
              </div>

              <p>{project.description}</p>

              <ul className="project-points">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="stack-list">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="project-links">
                <a href={project.code} target="_blank" rel="noreferrer">
                  Repository <Github size={15} />
                </a>
                {project.live ? (
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live site <ExternalLink size={15} />
                  </a>
                ) : null}
              </div>
            </div>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
};

export default Projects;
