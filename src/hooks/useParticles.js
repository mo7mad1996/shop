"use client";
import { useEffect, useRef } from "react";

export const useParticleEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);

      class Particle {
        constructor(x = null, y = null) {
          this.size = Math.random() * 3 + 1; // [min: 1, max: 4]
          this.x =
            x || Math.random() * (canvas.width - this.size * 2) - this.size * 3;
          this.y =
            y ||
            Math.random() * (canvas.height - this.size * 2) - this.size * 3;
          this.speedX = Math.random() * 2 - 1; // [min: -1, max: 1]
          this.speedY = Math.random() * 2 - 1; // [min: -1, max: 1]
        }

        draw() {
          ctx.beginPath();
          ctx.fillStyle = "#018b9a";
          ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
        }

        update() {
          this.draw();

          if (this.x > canvas.width - this.size || this.x < 0)
            this.speedX *= -1;
          if (this.y > canvas.height - this.size || this.y < 0)
            this.speedY *= -1;

          this.x += this.speedX;
          this.y += this.speedY;
        }
      }

      const particles = Array.from({ length: 20 }, () => new Particle());

      const handleCanvasClick = (e) => {
        particles.push(new Particle(e.clientX, e.clientY));
      };
      canvas.addEventListener("click", handleCanvasClick);

      const drawLine = (start, end, distance) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(1, 139, 154, ${1 - distance / 100})`;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
      };

      const animate = () => {
        ctx.fillStyle = "#020e19";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.update();

          particles.forEach((p) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - p.x, 2) + Math.pow(particle.y - p.y, 2)
            );

            if (distance < 100 && distance > 5) {
              drawLine(p, particle, distance);
            }
          });
        });

        requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        canvas.removeEventListener("click", handleCanvasClick);
      };
    }
  }, []);

  return canvasRef;
};
