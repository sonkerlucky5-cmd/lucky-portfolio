const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Designed & Built by Your Name</p>
      <p style={styles.year}>© 2024</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: "center",
    padding: "30px 0",
    borderTop: "1px solid #233554",
  },
  year: {
    color: "#64ffda",
    marginTop: "10px",
  },
};

export default Footer;