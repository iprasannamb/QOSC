import { useEffect, useRef, useState } from 'react';

interface AnimatedBackgroundProps {
  type?: 'particles' | 'video';
}

export default function AnimatedBackground({ type = 'particles' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoMounted, setIsVideoMounted] = useState(false);

  useEffect(() => {
    setIsVideoMounted(true);
    return () => setIsVideoMounted(false);
  }, []);

  useEffect(() => {
    if (type === 'particles') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to window size
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Particle properties
      const particles: Array<{
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
      }> = [];

      // Create particles
      const createParticles = () => {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
      };

      // Animate particles
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
          // Move particle
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Reset position if out of bounds
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`; // Purple color
          ctx.fill();

          // Draw connections
          particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 * (1 - distance/150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
              }
            }
          });
        });

        requestAnimationFrame(animate);
      };

      createParticles();
      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [type]);

  if (type === 'video' && isVideoMounted) {
    return (
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          key="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={(e) => console.error('Video loading error:', e)}
          className={`object-cover w-full h-full transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-90' : 'opacity-0'
          }`}
          style={{ filter: 'brightness(1.2)' }}
        >
          <source 
            src="/videos/3d-animation.mp4" 
            type="video/mp4"
          />
        </video>
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backdropFilter: 'blur(0.5px)' }}
        />
        
        <div 
          className={`absolute inset-0 bg-gray-900 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-900"
    />
  );
} 