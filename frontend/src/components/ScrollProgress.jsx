import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let maxScroll = 1;

    // Cache the max scroll calculation so we don't cause layout thrashing on every scroll event
    const measure = () => {
      const doc = document.documentElement;
      maxScroll = Math.max(doc.scrollHeight - doc.clientHeight, 1);
    };

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress}) translateZ(0)`;
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      measure();
      onScroll();
    }, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
