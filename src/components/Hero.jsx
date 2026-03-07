const Hero = () => {
  return (
    <section id="home" style={styles.hero}>
      <div style={styles.container}>
        
        {/* Intro */}
        <p style={styles.greeting}>Hi, my name is</p>
        
        {/* Main Name */}
        <h1 style={styles.name}>
          Your Name.
        </h1>
        
        {/* Tagline */}
        <h2 style={styles.subtitle}>
          I build things for the web.
        </h2>
        
        {/* Description */}
        <p style={styles.description}>
          I am a software developer specializing in building (and occasionally
          designing) exceptional digital experiences. Currently, I’m focused on
          building accessible, human-centered products at{" "}
          <span style={styles.highlight}>Your Company</span>.
        </p>

        {/* Buttons */}
        <div style={styles.btnContainer}>
          <a href="#projects" style={styles.primaryBtn}>
            Check My Work
          </a>
          <a href="#contact" style={styles.secondaryBtn}>
            Contact Me
          </a>
        </div>

      </div>
    </section>
  );
};

// 🎨 Internal Styles (CSS-in-JS)
const styles = {
  hero: {
    backgroundColor: "#0a192f", // Dark Navy Background
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 20px",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  greeting: {
    color: "#64ffda", // Green Accent
    fontSize: "1.2rem", // ~18px
    fontFamily: "'Fira Code', monospace",
    marginBottom: "20px",
    marginLeft: "5px",
  },
  name: {
    color: "#ccd6f6", // Lightest Slate
    fontSize: "clamp(40px, 8vw, 80px)", // Responsive Font
    fontWeight: "bold",
    lineHeight: "1.1",
    margin: "0",
  },
  subtitle: {
    color: "#8892b0", // Slate
    fontSize: "clamp(30px, 6vw, 60px)",
    fontWeight: "bold",
    lineHeight: "1.1",
    marginTop: "10px",
    marginBottom: "20px",
  },
  description: {
    color: "#8892b0",
    maxWidth: "540px",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "50px",
  },
  highlight: {
    color: "#64ffda",
  },
  btnContainer: {
    display: "flex",
    gap: "20px",
  },
  primaryBtn: {
    color: "#64ffda",
    backgroundColor: "transparent",
    border: "1px solid #64ffda",
    borderRadius: "4px",
    padding: "1.25rem 1.75rem",
    fontSize: "14px",
    fontFamily: "'Fira Code', monospace",
    lineHeight: "1",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)",
  },
  secondaryBtn: {
    color: "#ccd6f6",
    backgroundColor: "#112240", // Light Navy
    border: "1px solid #112240",
    borderRadius: "4px",
    padding: "1.25rem 1.75rem",
    fontSize: "14px",
    fontFamily: "'Fira Code', monospace",
    lineHeight: "1",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
};

export default Hero;