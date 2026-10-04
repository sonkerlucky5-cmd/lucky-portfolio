import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const MotionDiv = motion.div;

const Contact = ({ motionEase, mailtoUrl, contactEmail }) => {
  return (
    <section id="contact" className="section">
      <MotionDiv
        className="contact-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: motionEase }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -4 }}
      >
        <div className="contact-copy contact-copy-wide">
          <p className="eyebrow">CONTACT</p>
          <h2>Let us build your next project.</h2>
          <p>
            Fastest way to reach me is Gmail. If you have an idea, freelance
            project, or startup concept, send me a direct message there.
          </p>

          <a
            className="btn btn-primary contact-mail"
            href={mailtoUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Mail size={16} /> {contactEmail}
          </a>
        </div>
      </MotionDiv>
    </section>
  );
};

export default Contact;
