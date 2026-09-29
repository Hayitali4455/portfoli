import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Satellite, Radio, Compass, Activity, Eye, EyeOff, Layers, Sliders } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  label?: string;
  elevation?: number;
}

interface SatelliteObj {
  name: string;
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  tilt: number;
  color: string;
  sensor: string;
}

export default function GISDynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, isLight } = useTheme();
  const [telemetryCoord, setTelemetryCoord] = useState({ lat: '41.31108° N', lon: '69.24056° E', elev: '482 m', epsg: 'UTM 42N' });

  // Interactive Layer toggles
  const [showSatellites, setShowSatellites] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showTIN, setShowTIN] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Keep ref for render loop access
  const layersRef = useRef({
    showSatellites: true,
    showContours: true,
    showRadar: true,
    showTIN: true
  });

  useEffect(() => {
    layersRef.current = { showSatellites, showContours, showRadar, showTIN };
  }, [showSatellites, showContours, showRadar, showTIN]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive GIS crosshair & sonar
    let mouse = { x: -1000, y: -1000, isHovering: false };
    let sonarPings: { x: number; y: number; r: number; opacity: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouse.x = mx;
      mouse.y = my;
      mouse.isHovering = true;

      // Realistic Central Asia / Uzbekistan GIS Coordinates
      const lat = (41.45 - (my / height) * 0.45).toFixed(5);
      const lon = (69.15 + (mx / width) * 0.40).toFixed(5);
      const elev = Math.round(410 + (Math.sin(mx * 0.01) + Math.cos(my * 0.01)) * 90 + 50);
      setTelemetryCoord({
        lat: `${lat}° N`,
        lon: `${lon}° E`,
        elev: `${elev} m`,
        epsg: 'EPSG:32642'
      });
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      sonarPings.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 6,
        opacity: 1
      });
    };

    const parentElem = canvas.parentElement;
    if (parentElem) {
      parentElem.addEventListener('mousemove', handleMouseMove);
      parentElem.addEventListener('mouseleave', handleMouseLeave);
      parentElem.addEventListener('click', handleClick);
    }

    // Geodetic benchmark nodes
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 45);
    const nodes: Point[] = [];
    const geodeticLabels = ['ST-01 (RTK)', 'BENCH-42', 'CORS-TAS', 'REPER-104', 'SAR-CALIB', 'TIN-VERT', 'HYDR-09', 'ELEV-520', 'TRIG-08'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 2,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        label: i < 8 ? geodeticLabels[i % geodeticLabels.length] : undefined,
        elevation: Math.floor(400 + Math.random() * 350)
      });
    }

    // Satellites in orbit (Sentinel-2, Landsat-9, Copernicus SAR)
    const satellites: SatelliteObj[] = [
      { name: 'SENTINEL-2B (MSI)', angle: 0, speed: 0.0035, radiusX: width * 0.42, radiusY: height * 0.28, tilt: -0.25, color: '#10b981', sensor: 'OPTICAL 10m' },
      { name: 'LANDSAT-9 (OLI-2)', angle: Math.PI * 0.7, speed: 0.0028, radiusX: width * 0.48, radiusY: height * 0.35, tilt: 0.32, color: '#06b6d4', sensor: 'TIRS 30m' },
      { name: 'COPERNICUS-SAR', angle: Math.PI * 1.4, speed: 0.0042, radiusX: width * 0.35, radiusY: height * 0.22, tilt: -0.45, color: '#a855f7', sensor: 'C-BAND RADAR' }
    ];

    // Phases
    let contourPhase = 0;
    let scanLineY = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLightTheme = theme === 'light';
      const isMidnightTheme = theme === 'midnight';
      const { showSatellites: renderSats, showContours: renderContours, showRadar: renderRadar, showTIN: renderTIN } = layersRef.current;

      const contourColor1 = isLightTheme ? 'rgba(14, 165, 233, 0.14)' : isMidnightTheme ? 'rgba(16, 185, 129, 0.14)' : 'rgba(20, 184, 166, 0.16)';
      const contourColor2 = isLightTheme ? 'rgba(16, 185, 129, 0.10)' : isMidnightTheme ? 'rgba(6, 182, 212, 0.11)' : 'rgba(14, 165, 233, 0.13)';

      // -------------------------------------------------------------
      // 1. TOPOGRAPHIC CONTOUR ISOLINES (Rel'yef gorizontallari)
      // -------------------------------------------------------------
      if (renderContours) {
        contourPhase += 0.0025;
        const numContours = 6;
        for (let c = 0; c < numContours; c++) {
          const baseElevationY = (height / (numContours + 1)) * (c + 1);
          ctx.beginPath();
          ctx.strokeStyle = c % 2 === 0 ? contourColor1 : contourColor2;
          ctx.lineWidth = c % 3 === 0 ? 1.4 : 0.8;
          if (c % 2 === 1) {
            ctx.setLineDash([6, 6]);
          } else {
            ctx.setLineDash([]);
          }

          const step = 40;
          let first = true;
          for (let x = 0; x <= width + step; x += step) {
            const wave1 = Math.sin(x * 0.003 + contourPhase + c * 0.9) * 45;
            const wave2 = Math.cos(x * 0.006 - contourPhase * 0.8 + c * 0.5) * 25;
            const wave3 = Math.sin((x + c * 100) * 0.001) * 35;
            const y = baseElevationY + wave1 + wave2 + wave3;

            if (first) {
              ctx.moveTo(x, y);
              first = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Contour Elevation Label (+420m, +460m...)
          const labelX = (width * 0.2 + c * 180) % (width - 120);
          const waveLabel = Math.sin(labelX * 0.003 + contourPhase + c * 0.9) * 45 + Math.cos(labelX * 0.006 - contourPhase * 0.8 + c * 0.5) * 25;
          const labelY = baseElevationY + waveLabel;

          ctx.fillStyle = isLightTheme ? 'rgba(51, 65, 85, 0.5)' : 'rgba(148, 163, 184, 0.4)';
          ctx.font = '9px monospace';
          ctx.fillText(`+${420 + c * 40}m`, labelX, labelY - 4);
        }
      }

      // -------------------------------------------------------------
      // 2. RADAR / SENSOR SWATH SCAN LINE (Masofadan Zondlash nuri)
      // -------------------------------------------------------------
      if (renderRadar) {
        scanLineY = (scanLineY + 0.6) % height;
        const scanGrad = ctx.createLinearGradient(0, scanLineY - 45, 0, scanLineY);
        scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        scanGrad.addColorStop(0.85, isLightTheme ? 'rgba(16, 185, 129, 0.07)' : 'rgba(16, 185, 129, 0.10)');
        scanGrad.addColorStop(1, isLightTheme ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.38)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLineY - 45, width, 45);

        ctx.beginPath();
        ctx.strokeStyle = isLightTheme ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.55)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.stroke();

        ctx.fillStyle = isLightTheme ? 'rgba(16, 185, 129, 0.7)' : 'rgba(52, 211, 153, 0.7)';
        ctx.font = '9px monospace';
        ctx.fillText(`SWATH SCANNER • Y:${Math.round(scanLineY)}px • AZIMUTH 180.0°`, 24, scanLineY - 6);
      }

      // -------------------------------------------------------------
      // 3. GEODETIC NODES & TRIANGULATION (TIN Fazoviy To'r)
      // -------------------------------------------------------------
      if (renderTIN) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];

          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 10 || node.x > width - 10) node.vx *= -1;
          if (node.y < 10 || node.y > height - 10) node.vy *= -1;

          node.pulse += node.pulseSpeed;
          const currentRadius = node.radius + Math.sin(node.pulse) * 1.2;

          // Connections
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              ctx.beginPath();
              const alpha = (1 - dist / 140) * (isLightTheme ? 0.16 : 0.26);
              ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
              ctx.lineWidth = 0.7;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }

          // Node Point
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
          ctx.fillStyle = isLightTheme ? '#059669' : '#10b981';
          ctx.fill();

          if (node.label) {
            const waveRadius = (node.pulse * 7) % 25;
            const waveAlpha = Math.max(0, 1 - waveRadius / 25) * 0.4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, waveRadius + 3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(52, 211, 153, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = isLightTheme ? 'rgba(51, 65, 85, 0.7)' : 'rgba(148, 163, 184, 0.6)';
            ctx.font = '8px monospace';
            ctx.fillText(node.label, node.x + 8, node.y - 4);
            ctx.fillStyle = isLightTheme ? 'rgba(16, 185, 129, 0.85)' : 'rgba(52, 211, 153, 0.85)';
            ctx.fillText(`Z:${node.elevation}m`, node.x + 8, node.y + 6);
          }
        }
      }

      // -------------------------------------------------------------
      // 4. SATELLITE ORBITS (Sentinel-2, Landsat-9, Radar)
      // -------------------------------------------------------------
      if (renderSats) {
        satellites.forEach((sat) => {
          sat.angle += sat.speed;

          const centerX = width / 2;
          const centerY = height * 0.45;

          const cosTilt = Math.cos(sat.tilt);
          const sinTilt = Math.sin(sat.tilt);

          ctx.beginPath();
          ctx.strokeStyle = isLightTheme ? 'rgba(15, 23, 42, 0.07)' : 'rgba(148, 163, 184, 0.09)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.ellipse(centerX, centerY, sat.radiusX, sat.radiusY, sat.tilt, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          const rawX = Math.cos(sat.angle) * sat.radiusX;
          const rawY = Math.sin(sat.angle) * sat.radiusY;
          const satX = centerX + (rawX * cosTilt - rawY * sinTilt);
          const satY = centerY + (rawX * sinTilt + rawY * cosTilt);

          // Ground Swath
          ctx.beginPath();
          const swathWidth = 55;
          ctx.moveTo(satX, satY);
          ctx.lineTo(satX - swathWidth, satY + 85);
          ctx.lineTo(satX + swathWidth, satY + 85);
          ctx.closePath();
          const swathGrad = ctx.createLinearGradient(satX, satY, satX, satY + 85);
          swathGrad.addColorStop(0, sat.color + '33');
          swathGrad.addColorStop(1, sat.color + '00');
          ctx.fillStyle = swathGrad;
          ctx.fill();

          // Satellite Body
          ctx.fillStyle = sat.color;
          ctx.beginPath();
          ctx.arc(satX, satY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Solar Panels
          ctx.fillStyle = isLightTheme ? '#0284c7' : '#38bdf8';
          ctx.fillRect(satX - 11, satY - 1.5, 7, 3);
          ctx.fillRect(satX + 4, satY - 1.5, 7, 3);

          // Name Badge
          ctx.fillStyle = isLightTheme ? '#0f172a' : '#f8fafc';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`🛰️ ${sat.name}`, satX + 13, satY - 4);
          ctx.fillStyle = sat.color;
          ctx.font = '8px monospace';
          ctx.fillText(`${sat.sensor} • ALT 786km`, satX + 13, satY + 7);
        });
      }

      // -------------------------------------------------------------
      // 5. INTERACTIVE MOUSE CURSOR CROSSHAIR & SONAR
      // -------------------------------------------------------------
      if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = isLightTheme ? 'rgba(16, 185, 129, 0.45)' : 'rgba(52, 211, 153, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(0, mouse.y);
        ctx.lineTo(width, mouse.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mouse.x, 0);
        ctx.lineTo(mouse.x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = isLightTheme ? 'rgba(14, 165, 233, 0.7)' : 'rgba(6, 182, 212, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.fillStyle = isLightTheme ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = isLightTheme ? '#cbd5e1' : '#334155';
        ctx.lineWidth = 1;
        const boxW = 125;
        const boxH = 34;
        const boxX = mouse.x + 14 + boxW > width ? mouse.x - boxW - 14 : mouse.x + 14;
        const boxY = mouse.y - 38 < 10 ? mouse.y + 14 : mouse.y - 38;

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLightTheme ? '#0f172a' : '#34d399';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`🎯 ${telemetryCoord.lat}`, boxX + 6, boxY + 13);
        ctx.fillStyle = isLightTheme ? '#475569' : '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`${telemetryCoord.lon} | ${telemetryCoord.elev}`, boxX + 6, boxY + 26);
      }

      // Sonar Click Pings
      for (let p = sonarPings.length - 1; p >= 0; p--) {
        const ping = sonarPings[p];
        ping.r += 2.2;
        ping.opacity -= 0.02;

        if (ping.opacity <= 0) {
          sonarPings.splice(p, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${ping.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${ping.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parentElem) {
        parentElem.removeEventListener('mousemove', handleMouseMove);
        parentElem.removeEventListener('mouseleave', handleMouseLeave);
        parentElem.removeEventListener('click', handleClick);
      }
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Interactive HTML5 Canvas with GIS Animation */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block pointer-events-auto cursor-crosshair opacity-85" 
      />

      {/* Floating Spatial HUD Badges (Top & Bottom Corners) */}
      <div className="absolute top-4 right-4 hidden md:flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE TELEMETRY:</span>
          <span className="text-emerald-400 font-bold">{telemetryCoord.lat}, {telemetryCoord.lon}</span>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-lg">
          <span>CRS:</span>
          <span className="text-cyan-400 font-bold">WGS 84 / UTM 42N (EPSG:32642)</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-lg">
          <Satellite className="w-3 h-3 text-cyan-400" />
          <span>ORBIT MONITOR:</span>
          <span className="text-slate-200">Sentinel-2B & Landsat-9 Real-time Swath</span>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-slate-400 flex items-center gap-1 shadow-lg">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>ELEV:</span>
          <span className="text-emerald-400">{telemetryCoord.elev}</span>
        </div>
      </div>

      {/* Interactive Layer Customization Button (Bottom Right) */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-[10px] font-mono text-slate-300 shadow-xl transition"
            title="GIS fon qatlamlarini boshqarish"
          >
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">GIS Fon Qatlamlari</span>
          </button>

          {showControls && (
            <div className="absolute bottom-8 right-0 w-52 p-2 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl space-y-1.5 text-xs text-slate-300 animate-in fade-in duration-150">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1 pb-1">
                Dinamik GIS Qatlamlari
              </div>

              <button
                onClick={() => setShowSatellites(!showSatellites)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                  showSatellites ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>🛰️ Sun'iy Yo'ldoshlar</span>
                {showSatellites ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              </button>

              <button
                onClick={() => setShowContours(!showContours)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                  showContours ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>📈 Relyef Gorizontallari</span>
                {showContours ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              </button>

              <button
                onClick={() => setShowRadar(!showRadar)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                  showRadar ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>📡 Skaner (Swath) Nuri</span>
                {showRadar ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              </button>

              <button
                onClick={() => setShowTIN(!showTIN)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition ${
                  showTIN ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>🌐 Geodezik TIN To'ri</span>
                {showTIN ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
