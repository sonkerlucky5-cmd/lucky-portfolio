import { useEffect, useRef, useState } from "react";
import "./ParticleVortexPreloader.css";

const ParticleVortexPreloader = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [showSkip, setShowSkip] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const isCompletedRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    };
    
    setupCanvas();
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Particle system
    const maxParticles = width < 760 ? 8000 : 12000;
    const particles = {
      x: new Float32Array(maxParticles),
      y: new Float32Array(maxParticles),
      vx: new Float32Array(maxParticles),
      vy: new Float32Array(maxParticles),
      tx: new Float32Array(maxParticles),
      ty: new Float32Array(maxParticles),
      color: new Float32Array(maxParticles), // 0: resting, 1: moving, 2: fast
      speed: new Float32Array(maxParticles),
      released: new Uint8Array(maxParticles),
      index: 0
    };
    
    // Mouse/touch
    const mouse = { x: -2000, y: -2000, active: false };
    
    // Text sampling
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    textCanvas.width = width;
    textCanvas.height = height;
    
    const fontLoaded = document.fonts ? document.fonts.load('900 120px "Archivo Black"') : Promise.resolve();
    
    const sampleText = () => {
      textCtx.fillStyle = "#ffffff";
      textCtx.clearRect(0, 0, width, height);
      
      textCtx.font = '900 ' + (width < 760 ? Math.min(width * 0.12, 80) : Math.min(width * 0.08, 140)) + 'px "Archivo Black", Arial Black, sans-serif';
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      
      if (width < 760) {
        textCtx.fillText("LUCKY", width / 2, height / 2 - 40);
        textCtx.fillText("SONKER", width / 2, height / 2 + 40);
      } else {
        textCtx.fillText("LUCKY SONKER", width / 2, height / 2);
      }
      
      const imageData = textCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const targets = [];
      
      const step = width < 760 ? 4 : 3;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (data[idx + 3] > 128) {
            targets.push({ x, y });
            if (targets.length >= maxParticles) break;
          }
        }
        if (targets.length >= maxParticles) break;
      }
      
      // Initialize particles
      particles.index = Math.min(targets.length, maxParticles);
      for (let i = 0; i < particles.index; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(width, height) * 0.4 + 50;
        particles.x[i] = width / 2 + Math.cos(angle) * radius;
        particles.y[i] = height / 2 + Math.sin(angle) * radius;
        particles.vx[i] = (Math.random() - 0.5) * 2;
        particles.vy[i] = (Math.random() - 0.5) * 2;
        particles.tx[i] = targets[i].x;
        particles.ty[i] = targets[i].y;
        particles.released[i] = 0;
        particles.speed[i] = 0;
        particles.color[i] = 0;
      }
    };
    
    // Animation
    let startTime = Date.now();
    let progressValue = 0;
    let shockwaveActive = false;
    let shockwaveStart = 0;
    let shockwaveRadius = 0;
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const animate = () => {
      if (isCompletedRef.current && shockwaveActive) {
        // Draw shockwave reveal
        ctx.fillStyle = "#EDEAFF";
        ctx.fillRect(0, 0, width, height);
        
        const elapsed = Date.now() - shockwaveStart;
        const progress = Math.min(elapsed / 1400, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        shockwaveRadius = Math.max(width, height) * 2 * eased;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, shockwaveRadius, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw particles flying out
        for (let i = 0; i < particles.index; i++) {
          if (particles.released[i]) {
            particles.vx[i] *= 1.02;
            particles.vy[i] *= 1.02;
            particles.x[i] += particles.vx[i];
            particles.y[i] += particles.vy[i];
            
            const dx = particles.x[i] - width / 2;
            const dy = particles.y[i] - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            ctx.fillStyle = "#FF6A4D";
            ctx.beginPath();
            ctx.arc(particles.x[i], particles.y[i], 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        
        // Hero text
        if (progress > 0.3) {
          ctx.save();
          ctx.globalAlpha = Math.min((progress - 0.3) / 0.4, 1);
          ctx.font = '900 ' + Math.min(width * 0.06, 80) + 'px "Archivo Black", Arial Black, sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#0E0B22";
          ctx.fillText("LUCKY", width / 2, height / 2 - 30);
          ctx.fillStyle = "#FF4D2E";
          ctx.fillText("SONKER", width / 2, height / 2 + 30);
          ctx.restore();
        }
        
        if (progress >= 1) {
          // Show replay button
          setShowReplay(true);
          document.body.style.overflow = "";
          return;
        }
        
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Normal preloader
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / 3600, 1);
      progressValue = easeInOutCubic(t);
      setProgress(Math.floor(progressValue * 100));
      
      // Trail effect
      ctx.fillStyle = "rgba(7, 6, 15, 0.22)";
      ctx.fillRect(0, 0, width, height);
      
      // Release particles
      const releaseCount = Math.floor(particles.index * progressValue);
      for (let i = 0; i < releaseCount && i < particles.index; i++) {
        if (!particles.released[i]) {
          particles.released[i] = 1;
        }
      }
      
      // Update particles
      for (let i = 0; i < particles.index; i++) {
        if (particles.released[i]) {
          const dx = particles.tx[i] - particles.x[i];
          const dy = particles.ty[i] - particles.y[i];
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0.5) {
            particles.vx[i] += dx * 0.01;
            particles.vy[i] += dy * 0.01;
          }
          
          particles.vx[i] *= 0.92;
          particles.vy[i] *= 0.92;
          
          particles.x[i] += particles.vx[i];
          particles.y[i] += particles.vy[i];
          
          particles.speed[i] = Math.sqrt(particles.vx[i] * particles.vx[i] + particles.vy[i] * particles.vy[i]);
          
          if (particles.speed[i] > 2) particles.color[i] = 2;
          else if (particles.speed[i] > 0.5) particles.color[i] = 1;
          else particles.color[i] = 0;
        } else {
          // Vortex
          const dx = particles.x[i] - width / 2;
          const dy = particles.y[i] - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          particles.vx[i] += (-dy / dist) * 0.02;
          particles.vy[i] += (dx / dist) * 0.02;
          particles.vx[i] *= 0.98;
          particles.vy[i] *= 0.98;
          
          particles.x[i] += particles.vx[i];
          particles.y[i] += particles.vy[i];
          
          particles.speed[i] = Math.sqrt(particles.vx[i] * particles.vx[i] + particles.vy[i] * particles.vy[i]);
          particles.color[i] = particles.speed[i] > 1.5 ? 1 : 0;
        }
        
        // Mouse repel
        if (!prefersReducedMotion && mouse.active) {
          const mdx = particles.x[i] - mouse.x;
          const mdy = particles.y[i] - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 110 && mdist > 0) {
            particles.vx[i] += (mdx / mdist) * 2;
            particles.vy[i] += (mdy / mdist) * 2;
          }
        }
      }
      
      // Draw particles by color bucket
      // Bucket 0: resting
      ctx.fillStyle = "#B9C0FF";
      ctx.beginPath();
      for (let i = 0; i < particles.index; i++) {
        if (particles.color[i] === 0) {
          ctx.moveTo(particles.x[i] + 1, particles.y[i]);
          ctx.arc(particles.x[i], particles.y[i], 1, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      
      // Bucket 1: moving
      ctx.fillStyle = "#FF6A4D";
      ctx.beginPath();
      for (let i = 0; i < particles.index; i++) {
        if (particles.color[i] === 1) {
          ctx.moveTo(particles.x[i] + 1.2, particles.y[i]);
          ctx.arc(particles.x[i], particles.y[i], 1.2, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      
      // Bucket 2: fast
      ctx.fillStyle = "#FFF1D6";
      ctx.beginPath();
      for (let i = 0; i < particles.index; i++) {
        if (particles.color[i] === 2) {
          ctx.moveTo(particles.x[i] + 1.5, particles.y[i]);
          ctx.arc(particles.x[i], particles.y[i], 1.5, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      
      // Counter
      ctx.font = '900 ' + Math.min(width * 0.08, 100) + 'px "Archivo Black", Arial Black, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "#ffffff";
      const counterText = String(Math.floor(progressValue * 100)).padStart(3, '0');
      ctx.fillText(counterText, 40, height - 40);
      
      if (progressValue >= 1 && !shockwaveActive) {
        setTimeout(() => {
          shockwaveActive = true;
          shockwaveStart = Date.now();
          isCompletedRef.current = true;
          setShowSkip(false);
        }, 550);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Mouse events
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    
    const handleTouchEnd = () => {
      mouse.active = false;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", () => {
      setupCanvas();
      sampleText();
    });
    
    // Start
    Promise.all([
      fontLoaded,
      new Promise(resolve => setTimeout(resolve, 1500))
    ]).then(() => {
      sampleText();
      startTime = Date.now();
      animate();
    });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const handleSkip = () => {
    isCompletedRef.current = true;
    shockwaveActive = true;
    shockwaveStart = Date.now();
    setShowSkip(false);
  };
  
  const handleReplay = () => {
    window.location.reload();
  };

  return (
    <div className="particle-preloader">
      <canvas ref={canvasRef} className="particle-canvas" />
      
      {showSkip && (
        <button className="preloader-skip" onClick={handleSkip}>
          SKIP
        </button>
      )}
      
      {showReplay && (
        <button className="preloader-replay" onClick={handleReplay}>
          REPLAY
        </button>
      )}
      
      {!showReplay && (
        <div className="preloader-counter">
          {String(progress).padStart(3, '0')}
        </div>
      )}
    </div>
  );
};

export default ParticleVortexPreloader;
