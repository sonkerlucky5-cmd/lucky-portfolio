const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>{"<Dev />"}</div>
      <ul style={styles.ul}>
        <li><a href="#home" style={styles.link}>Home</a></li>
        <li><a href="#projects" style={styles.link}>Projects</a></li>
        <li><a href="#contact" style={styles.link}>Contact</a></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    position: "sticky",
    top: 0,
    backgroundColor: "#0a192f",
    zIndex: 100,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#64ffda",
  },
  ul: {
    display: "flex",
    listStyle: "none",
    gap: "30px",
  },
  link: {
    color: "#ccd6f6",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color 0.3s",
  },
};

export default Navbar;