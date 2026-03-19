const Projects = () => {
  const projectsList = [
    {
      title: "Project 1",
      description: "A full-stack web application built with React & Node.js",
      tech: ["React", "Node.js", "MongoDB"],
      github: "#",
      live: "#",
    },
    {
      title: "Project 2",
      description: "E-commerce platform with payment integration",
      tech: ["React", "Express", "Stripe"],
      github: "#",
      live: "#",
    },
  ];

  return (
    <section id="projects">
      <h2>Featured Projects</h2>
      <div style={styles.grid}>
        {projectsList.map((project, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{project.title}</h3>
            <p>{project.description}</p>
            <div style={styles.tech}>
              {project.tech.map((t, i) => (
                <span key={i} style={styles.techBadge}>{t}</span>
              ))}
            </div>
            <div style={styles.links}>
              <a href={project.github} style={styles.link}>GitHub</a>
              <a href={project.live} style={styles.link}>Live Demo</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#112240",
    padding: "30px",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
  },
  cardTitle: {
    color: "#ccd6f6",
    marginBottom: "15px",
  },
  tech: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  techBadge: {
    color: "#64ffda",
    fontSize: "0.85rem",
  },
  links: {
    marginTop: "20px",
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#64ffda",
    textDecoration: "none",
  },
};

export default Projects;