import { motion } from "framer-motion";
import { Briefcase, ExternalLink, Github } from "lucide-react";

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
  );
};

export default Projects;
