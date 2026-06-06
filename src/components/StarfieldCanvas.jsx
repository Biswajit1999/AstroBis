import React, { useEffect, useRef } from 'react';

const StarfieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Build star layers: deeper = smaller & dimmer, less parallax
    const stars = Array.from({ length: 450 }, () => {
      const layer = Math.ceil(Math.random() * 4); // 1=front … 4=back
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        layer,
        size:      0.3 + (5 - layer) * 0.35 * Math.random(),
        baseAlpha: 0.2 + Math.random() * 0.8,
        phase:     Math.random() * Math.PI * 2,
        speed:     0.4 + Math.random() * 1.2,
        hue:       ['255,255,255', '200,210,255', '255,240,200', '180,220,255'][Math.floor(Math.random() * 4)],
      };
    });

    // Shooting stars
    const shoots = [];
    const spawnShoot = () => {
      if (shoots.length >= 4 && Math.random() > 0.002) return;
      shoots.push({
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.4,
        vx: 6 + Math.random() * 9,
        vy: 2 + Math.random() * 5,
        len: 90 + Math.random() * 130,
        life: 1,
      });
    };

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 30;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    window.addEventListener('mousemove', onMouseMove);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      // Stars
      for (const s of stars) {
        const px = (mouse.x * (5 - s.layer) * 0.05);
        const py = (mouse.y * (5 - s.layer) * 0.05);
        const x  = ((s.x + px) % canvas.width  + canvas.width)  % canvas.width;
        const y  = ((s.y + py) % canvas.height + canvas.height) % canvas.height;
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const a  = s.baseAlpha * (0.5 + 0.5 * tw);

        // Larger stars get a soft glow
        if (s.size > 1.2) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, s.size * 2.5);
          g.addColorStop(0, `rgba(${s.hue},${a})`);
          g.addColorStop(1, `rgba(${s.hue},0)`);
          ctx.beginPath();
          ctx.arc(x, y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${a})`;
        ctx.fill();
      }

      // Shooting stars
      spawnShoot();
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.len, sh.y - sh.len * 0.4);
        g.addColorStop(0, `rgba(255,255,255,${sh.life})`);
        g.addColorStop(0.4, `rgba(200,200,255,${sh.life * 0.4})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.len, sh.y - sh.len * 0.38);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.018;
        if (sh.life <= 0 || sh.x > canvas.width || sh.y > canvas.height) shoots.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default StarfieldCanvas;
