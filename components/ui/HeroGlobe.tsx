'use client';

import React, { useEffect, useRef } from 'react';

interface City {
  name: string;
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  z?: number;
  phase: number;
}

const CITIES: City[] = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, phase: 0 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, phase: 1.2 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, phase: 2.1 },
  { name: 'London', lat: 51.5074, lng: -0.1278, phase: 3.4 },
  { name: 'New York', lat: 40.7128, lng: -74.006, phase: 4.2 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, phase: 5.1 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, phase: 0.8 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, phase: 2.7 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, phase: 3.9 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, phase: 1.7 },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, phase: 4.8 },
];

const FLIGHT_ARCS: [number, number][] = [
  [0, 2], // Delhi -> Dubai
  [0, 3], // Delhi -> London
  [1, 2], // Mumbai -> Dubai
  [1, 3], // Mumbai -> London
  [8, 5], // Hyderabad -> Singapore
  [7, 9], // Bengaluru -> Paris
  [3, 4], // London -> New York
  [5, 6], // Singapore -> Tokyo
  [0, 10], // Delhi -> Frankfurt
];

export function HeroGlobe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mobile battery optimization: skip rendering 3D canvas on small mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let rotY = 0.4;
    let rotX = 0.22;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Generate Fibonacci dot distribution
    const DOT_COUNT = 900;
    const dots: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
      const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
      dots.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      });
    }

    // Convert latitude/longitude to unit sphere coordinates
    function latLngToVector(lat: number, lng: number) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + 180) * Math.PI) / 180;
      return {
        x: -Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      };
    }

    const cities = CITIES.map((c) => ({
      ...c,
      ...latLngToVector(c.lat, c.lng),
    }));

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width - 0.5;
      targetMouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const onMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    let time = 0;

    function render() {
      if (!ctx || width === 0 || height === 0) return;

      time += 0.016;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Slow smooth auto-rotation
      rotY += 0.0016;
      const currentRotX = rotX + mouseY * 0.25;
      const currentRotY = rotY + mouseX * 0.4;

      ctx.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      function project(x: number, y: number, z: number, scale = radius) {
        // Y-axis rotation
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // X-axis rotation
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 3.6;
        const p = fov / (fov + z2);
        return {
          px: cx + x1 * scale * p,
          py: cy - y2 * scale * p,
          pz: z2,
          visible: z2 > -0.2,
        };
      }

      // Draw faint background radial glow behind globe
      const bgGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.2);
      bgGrad.addColorStop(0, 'rgba(0, 98, 224, 0.18)');
      bgGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.06)');
      bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Draw Fibonacci dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const p = project(d.x, d.y, d.z);

        if (p.visible) {
          const depthAlpha = Math.max(0.12, (p.pz + 1) / 2);
          ctx.beginPath();
          ctx.arc(p.px, p.py, 1.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${depthAlpha * 0.7})`;
          ctx.fill();
        }
      }

      // Project cities
      const projectedCities = cities.map((c) => {
        const p = project(c.x!, c.y!, c.z!);
        return { ...c, ...p };
      });

      // Draw Great-Circle Flight Arcs
      FLIGHT_ARCS.forEach(([idxA, idxB]) => {
        const cityA = projectedCities[idxA];
        const cityB = projectedCities[idxB];

        if (!cityA || !cityB) return;
        if (cityA.pz < -0.35 && cityB.pz < -0.35) return;

        const steps = 36;
        const arcPoints: { px: number; py: number; pz: number }[] = [];

        const posA = { x: cities[idxA].x!, y: cities[idxA].y!, z: cities[idxA].z! };
        const posB = { x: cities[idxB].x!, y: cities[idxB].y!, z: cities[idxB].z! };

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          // Slerp interpolation
          const lx = posA.x * (1 - t) + posB.x * t;
          const ly = posA.y * (1 - t) + posB.y * t;
          const lz = posA.z * (1 - t) + posB.z * t;
          const mag = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;

          // Elevated parabolic altitude peak
          const alt = 1 + Math.sin(t * Math.PI) * 0.16;
          const px = (lx / mag) * alt;
          const py = (ly / mag) * alt;
          const pz = (lz / mag) * alt;

          arcPoints.push(project(px, py, pz));
        }

        ctx.beginPath();
        let started = false;
        arcPoints.forEach((pt) => {
          if (pt.pz > -0.2) {
            if (!started) {
              ctx.moveTo(pt.px, pt.py);
              started = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          }
        });

        ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Moving flight light particle along arc
        const progress = (time * 0.35 + idxA * 0.25) % 1;
        const particleIdx = Math.floor(progress * (arcPoints.length - 1));
        const particlePt = arcPoints[particleIdx];

        if (particlePt && particlePt.pz > -0.1) {
          ctx.beginPath();
          ctx.arc(particlePt.px, particlePt.py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0062e0';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw City Markers & Pulsing Halos
      projectedCities.forEach((city) => {
        if (!city.visible || city.pz < -0.15) return;

        const pulse = Math.sin(time * 2.2 + city.phase);
        const ringRadius = 5 + pulse * 2.5;
        const ringAlpha = Math.max(0.1, 0.45 - pulse * 0.2);

        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(city.px, city.py, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(city.px, city.py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0062e0';
        ctx.fill();

        // City Label on front-facing nodes
        if (city.pz > 0.3) {
          ctx.font = '600 10px Plus Jakarta Sans, Inter, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillText(city.name, city.px + 7, city.py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[540px] max-h-[540px] transition-opacity duration-700 opacity-95"
      />
    </div>
  );
}
