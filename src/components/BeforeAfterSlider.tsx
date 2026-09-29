import React, { useState, useRef, useCallback } from 'react';
import { Layers } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
  description?: string;
}

export default function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel = 'Oldingi holat',
  afterLabel = 'Keyingi holat',
  description
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Layers className="w-3.5 h-3.5" /> Masofadan zondlash dinamikasi (Interaktiv Taqqoslash)
        </span>
        <span className="text-[11px] font-mono text-slate-500">Surgichni suring</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden select-none cursor-ew-resize bg-slate-900 shadow-xl"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <img
          src={afterImg}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold text-amber-300 shadow-sm">
          {afterLabel}
        </div>

        {/* Before Image (Foreground with clip-path) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImg}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold text-emerald-300 shadow-sm">
            {beforeLabel}
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.7)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg text-xs font-bold ring-2 ring-white">
            ⇄
          </div>
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg shadow-sm">
          <strong className="text-slate-200">Xulosa:</strong> {description}
        </p>
      )}
    </div>
  );
}
