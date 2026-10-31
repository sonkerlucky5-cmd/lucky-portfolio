import { useEffect, useRef, useState } from "react";
import "./CursivePreloader.css";

const CursivePreloader = ({ onComplete }) => {
  const preloaderRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsExiting(true);
      preloaderRef.current?.classList.add("is-exit");

      setTimeout(() => {
        document.body.style.overflow = "";
        setIsHidden(true);
        onComplete?.();
      }, 1200);
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isHidden) return null;

  return (
    <div ref={preloaderRef} className={`cursive-preloader ${isExiting ? "is-exit" : ""}`}>
      <div className="cursive-bg"></div>
      
      <div className="cursive-container">
        <div className="cursive-text-wrap">
          <svg className="cursive-svg" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cursiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff">
                  <animate attributeName="stop-color" values="#ffffff; #f0f0f0; #ffffff" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#e0e0e0">
                  <animate attributeName="stop-color" values="#e0e0e0; #ffffff; #e0e0e0" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#ffffff">
                  <animate attributeName="stop-color" values="#ffffff; #f0f0f0; #ffffff" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              className="cursive-path-text"
              fill="none"
              stroke="url(#cursiveGradient)"
              strokeWidth="2"
            >
              Portfolio
            </text>
            
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              className="cursive-path-text-fill"
              fill="#ffffff"
            >
              Portfolio
            </text>
            
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              className="cursive-subtitle"
              fill="rgba(255,255,255,0.7)"
            >
              by Lucky Sonker
            </text>
          </svg>
        </div>
      </div>
      
      <div className="cursive-curtain"></div>
    </div>
  );
};

export default CursivePreloader;
