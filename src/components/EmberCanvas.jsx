import React, { useEffect, useRef } from 'react';

export default function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const PARTICLE_COUNT = 75;
    const particles = [];

    const createParticle = (initialY = null) => {
      return {
        x: Math.random() * width,
        y: initialY !== null ? initialY : height + Math.random() * 20,
        radius: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.003 + 0.002,
        hue: Math.random() < 0.3 ? 42 : Math.random() < 0.7 ? 32 : 18,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    let time = 0;
    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += Math.sin(time * p.swaySpeed + p.swayOffset) * 0.6 + p.speedX;
        p.opacity -= p.fadeSpeed;

        if (p.y < -10 || p.opacity <= 0 || p.x < -10 || p.x > width + 10) {
          particles[i] = createParticle();
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 68%, ${p.opacity})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 95%, 52%, ${p.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, 0.8)`;
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ember-canvas" aria-hidden="true" />;
}
