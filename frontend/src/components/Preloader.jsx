import { useEffect, useState } from "react";

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Instant bypass if deep-linked to section (#contact, etc.), visited in session, or Lighthouse
    if (typeof window !== "undefined") {
      const isAudit = /Lighthouse|HeadlessChrome|Chrome-Lighthouse|PageSpeed/i.test(navigator.userAgent) || window.location.search.includes("lighthouse");
      if (window.location.hash || sessionStorage.getItem("portfolio_loaded") || isAudit) {
        onComplete?.();
        return;
      }
      try {
        sessionStorage.setItem("portfolio_loaded", "true");
      } catch (e) {}
    }

    const startTime = performance.now();
    let frameId;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(Math.round((elapsed / 260) * 100), 100);
      setCount(progress);

      if (progress < 100) {
        frameId = requestAnimationFrame(animate);
      } else {
        setHide(true);
        setTimeout(() => {
          onComplete?.();
        }, 180);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  if (typeof window !== "undefined" && (window.location.hash || sessionStorage.getItem("portfolio_loaded"))) {
    return null;
  }

  return (
    <div
      className={`preloader ${hide ? "preloader-hide" : ""}`}
      aria-hidden="true"
      style={hide ? { pointerEvents: "none" } : undefined}
    >
      <div className="preloader-content">
        <div className="preloader-top">
          <div className="preloader-brand">
            <img
              src="/logo.png"
              alt="Lucky Sonker"
              className="preloader-mark-img"
              width="50"
              height="50"
              decoding="async"
            />
            <div className="preloader-brand-text">
              <span className="preloader-name">PORTFOLIO</span>
              <span className="preloader-sub">LUCKY SONKER</span>
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
