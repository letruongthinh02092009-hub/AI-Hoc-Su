import React, { useEffect, useRef } from 'react';

/**
 * AmbientEmbersCanvas - Hiệu ứng tàn tro lửa Tây Sơn bay lơ lửng (Ambient Floating Embers)
 * Tối ưu hóa 60fps tuyệt đối bằng Canvas API thuần, tự động tạm dừng khi tab ẩn để tiết kiệm pin/GPU.
 */
export default function AmbientEmbersCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Bảng màu tàn tro lửa Tây Sơn (Hổ phách, Vàng hoàng gia, Đỏ chu sa)
    const emberColors = [
      'rgba(244, 208, 111, ', // Vàng kim sáng
      'rgba(229, 169, 60, ',  // Vàng kim hoàng gia
      'rgba(255, 107, 74, ',  // Cam lửa rực
      'rgba(216, 74, 56, ',   // Đỏ chu sa
      'rgba(158, 42, 43, '    // Đỏ trầm
    ];

    // Số lượng hạt vừa phải (35 hạt) bảo đảm không che khuất chữ và 60fps mượt mà
    const particleCount = Math.min(Math.floor(width / 35), 40);
    const particles = [];

    class EmberParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 20;
        this.size = Math.random() * 2.2 + 0.8; // Hạt nhỏ tinh tế (0.8px - 3px)
        this.speedY = Math.random() * 0.65 + 0.25; // Bay lên từ tốn
        this.speedX = (Math.random() - 0.5) * 0.35; // Trôi ngang nhẹ theo gió
        this.colorPrefix = emberColors[Math.floor(Math.random() * emberColors.length)];
        this.maxOpacity = Math.random() * 0.55 + 0.25;
        this.opacity = initial ? Math.random() * this.maxOpacity : 0;
        this.fadeIn = true;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.swing = Math.random() * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.swing) * 0.3;
        this.swing += this.swingSpeed;

        if (this.fadeIn) {
          this.opacity += this.pulseSpeed;
          if (this.opacity >= this.maxOpacity) {
            this.fadeIn = false;
          }
        } else {
          this.opacity -= this.pulseSpeed * 0.6;
        }

        // Tái tạo lại khi bay ra khỏi màn hình hoặc hết độ sáng
        if (this.y < -20 || this.opacity <= 0) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0, this.opacity)})`;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `${this.colorPrefix}0.6)`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new EmberParticle());
    }

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isTabVisible) {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0;
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="ambient-embers-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        height: '100%'
      }}
    />
  );
}
