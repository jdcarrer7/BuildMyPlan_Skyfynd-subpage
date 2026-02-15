'use client';

import { memo } from 'react';

const FloatingStars = memo(function FloatingStars() {
  const stars = [];
  for (let i = 0; i < 35; i++) {
    const left = (i * 3.2) % 100;
    const top = 3 + ((i * 19) % 94);
    const size = 1.5 + (i % 3) * 0.5;
    const duration = 5 + (i * 0.25) % 4;
    const delay = (i * 0.18) % 5;
    const isTwinkle = i % 2 === 0;

    stars.push({ id: i, left, top, size, duration, delay, isTwinkle });
  }

  return (
    <>
      <style>{`
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-8px) scale(1.05); opacity: 0.4; }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; box-shadow: 0 0 2px rgba(255,255,255,0.2); }
          30% { transform: translateY(-4px) scale(1.1); opacity: 0.3; box-shadow: 0 0 4px rgba(255,255,255,0.3); }
          50% { transform: translateY(-8px) scale(1.3); opacity: 0.85; box-shadow: 0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(200,220,255,0.3); }
          70% { transform: translateY(-4px) scale(1.1); opacity: 0.3; box-shadow: 0 0 4px rgba(255,255,255,0.3); }
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'fixed',
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 2px rgba(255,255,255,0.3)',
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `${star.isTwinkle ? 'starTwinkle' : 'starFloat'} ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
});

export default FloatingStars;
