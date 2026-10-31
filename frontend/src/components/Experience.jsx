import { motion } from "framer-motion";
import { Building2, CalendarClock } from "lucide-react";

const MotionDiv = motion.div;
const MotionLi = motion.li;

const Experience = ({ experience, motionEase }) => {
  return (
    <section id="experience" className="section">
      <MotionDiv
        className="section-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: motionEase }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <p className="eyebrow">EXPERIENCE</p>
        <h2>Where I&apos;ve worked and what I owned.</h2>
      </MotionDiv>

      <ol className="timeline">
        {experience.map((item, index) => (
          <MotionLi
            key={`${item.role}-${item.company}`}
            className="timeline-item"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: motionEase,
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className={`timeline-marker ${item.status}`} aria-hidden="true">
              <Building2 size={16} />
            </div>

            <div className="timeline-body">
              <div className="timeline-top">
                <h3>{item.role}</h3>
                <span className={`timeline-tag ${item.status}`}>
                  <CalendarClock size={13} />
                  {item.period}
                </span>
              </div>
              <p className="timeline-company">{item.company}</p>
              <p className="timeline-summary">{item.summary}</p>
              <ul className="timeline-points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </MotionLi>
        ))}
      </ol>
    </section>
  );
};

export default Experience;
