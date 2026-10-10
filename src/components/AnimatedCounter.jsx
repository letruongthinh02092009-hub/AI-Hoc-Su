import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter - Hiệu ứng số nhảy mượt mà (0 -> target) khi người dùng cuộn tới.
 */
export default function AnimatedCounter({ 
  value, 
  duration = 1600, 
  decimals = 0, 
  prefix = '', 
  suffix = '' 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = counterRef.current;
    if (!node) return;

    // Phân tích giá trị số nguyên/thực
    const numericTarget = typeof value === 'number' 
      ? value 
      : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Hàm gia tốc easeOutExpo
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = easeOutProgress * numericTarget;
            
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(numericTarget);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.floor(displayValue);

  return (
    <span ref={counterRef} className="animated-counter-num">
      {prefix}{formatted}{suffix}
    </span>
  );
}
