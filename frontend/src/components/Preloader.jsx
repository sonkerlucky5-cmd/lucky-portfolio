import { useEffect, useState } from "react";

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 12);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 100) {
      setTimeout(() => {
        setHide(true);
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 400);
    }
  }, [count, onComplete]);

  return (
    <div className={`preloader ${hide ? "preloader-hide" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-top">
          <div className="preloader-brand">
            <img
              src="/logo.png"
              alt="Lucky Sonker"
              className="preloader-mark-img"
              width="50"
              height="50"
            />
            <div className="preloader-brand-text">
              <span className="preloader-name">LUCKY SONKER</span>
              <span className="preloader-sub">SOFTWARE ENGINEER</span>
            </div>
          </div>
        </div>

        <div className="preloader-bottom">
          <div className="preloader-counter">
            <span className="preloader-count">{count}</span>
            <span className="preloader-percent">%</span>
          </div>
          <div className="preloader-bar">
            <div
              className="preloader-bar-fill"
              style={{ width: `${count}%` }}
            />
          </div>
        </div>
      </div>

      <div className="preloader-overlay" />
    </div>
  );
};

export default Preloader;
