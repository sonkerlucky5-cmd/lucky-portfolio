import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/contact`, formData);

      if (res.data.success) {
        setStatus("✅ Message Sent Successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      setStatus(" Something went wrong!");
    }
    
    setLoading(false);
    setTimeout(() => setStatus(""), 5000);
  };

  return (
    <section id="contact" style={styles.section}>
      <h2>Get In Touch</h2>
      <p style={styles.subtitle}>
        Have a question or want to work together? Drop a message!
      </p>

      {status && <p style={styles.status}>{status}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          style={styles.textarea}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Sending..." : "Send Message 🚀"}
        </button>
      </form>
    </section>
  );
};

const styles = {
  section: {
    textAlign: "center",
  },
  subtitle: {
    marginBottom: "40px",
  },
  status: {
    padding: "10px",
    backgroundColor: "#112240",
    borderRadius: "5px",
    marginBottom: "20px",
    color: "#64ffda",
  },
  form: {
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "15px",
    backgroundColor: "#112240",
    border: "1px solid #233554",
    borderRadius: "5px",
    color: "#ccd6f6",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    padding: "15px",
    backgroundColor: "#112240",
    border: "1px solid #233554",
    borderRadius: "5px",
    color: "#ccd6f6",
    fontSize: "1rem",
    resize: "vertical",
    outline: "none",
  },
};

export default Contact;
