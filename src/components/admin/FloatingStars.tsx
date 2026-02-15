'use client';

import { memo } from 'react';

const FloatingStars = memo(function FloatingStars() {
  // Regular stars — lots of tiny ones
  const stars = [];
  for (let i = 0; i < 120; i++) {
    const left = (i * 2.73 + (i * i * 0.37)) % 100;
    const top = 1 + ((i * 17.3 + i * 0.7) % 98);
    const size = 0.8 + (i % 5) * 0.4;
    const duration = 4 + (i * 0.31) % 6;
    const delay = (i * 0.23) % 7;
    const isTwinkle = i % 3 !== 0;
    const brightness = 0.5 + (i % 4) * 0.15;

    stars.push({ id: i, left, top, size, duration, delay, isTwinkle, brightness });
  }

  // Bright accent stars — a few larger, more colorful ones
  const accentStars = [
    { id: 'a0', left: 8, top: 12, size: 3, color: 'rgba(167,139,250,0.6)', glow: 'rgba(167,139,250,0.3)', duration: 6, delay: 0.5 },
    { id: 'a1', left: 92, top: 25, size: 2.5, color: 'rgba(96,175,250,0.5)', glow: 'rgba(96,175,250,0.3)', duration: 7, delay: 1.2 },
    { id: 'a2', left: 45, top: 8, size: 2, color: 'rgba(52,211,153,0.4)', glow: 'rgba(52,211,153,0.2)', duration: 5.5, delay: 2.3 },
    { id: 'a3', left: 75, top: 85, size: 2.5, color: 'rgba(167,139,250,0.5)', glow: 'rgba(167,139,250,0.25)', duration: 8, delay: 0.8 },
    { id: 'a4', left: 20, top: 70, size: 2, color: 'rgba(96,175,250,0.45)', glow: 'rgba(96,175,250,0.2)', duration: 6.5, delay: 3.1 },
    { id: 'a5', left: 60, top: 92, size: 1.8, color: 'rgba(52,211,153,0.4)', glow: 'rgba(52,211,153,0.2)', duration: 7.5, delay: 1.8 },
  ];

  return (
    <>
      <style>{`
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-6px) scale(1.05); opacity: 0.4; }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; box-shadow: 0 0 1px rgba(255,255,255,0.15); }
          25% { opacity: 0.2; }
          50% { transform: translateY(-5px) scale(1.4); opacity: 0.9; box-shadow: 0 0 6px rgba(255,255,255,0.5), 0 0 12px rgba(200,220,255,0.25); }
          75% { opacity: 0.2; }
        }
        @keyframes accentPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0.8; }
        }
@keyframes nebulaShift {
          0%, 100% { opacity: 0.03; transform: scale(1) rotate(0deg); }
          33% { opacity: 0.06; transform: scale(1.05) rotate(2deg); }
          66% { opacity: 0.04; transform: scale(0.98) rotate(-1deg); }
        }
      `}</style>

      {/* Nebula / galaxy glow patches */}
      <div
        style={{
          position: 'fixed',
          top: '5%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.08) 0%, rgba(96,175,250,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'nebulaShift 20s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '0%',
          width: '500px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(96,175,250,0.06) 0%, rgba(52,211,153,0.03) 40%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'nebulaShift 25s ease-in-out infinite 5s',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '40%',
          left: '30%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.04) 0%, rgba(52,211,153,0.02) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'nebulaShift 18s ease-in-out infinite 10s',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Star field */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'fixed',
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${star.brightness})`,
            boxShadow: `0 0 ${star.size}px rgba(255,255,255,0.15)`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `${star.isTwinkle ? 'starTwinkle' : 'starFloat'} ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* Accent stars — colored, with glow */}
      {accentStars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'fixed',
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.glow}, 0 0 ${star.size * 6}px ${star.glow}`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animation: `accentPulse ${star.duration}s ease-in-out infinite`,
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
