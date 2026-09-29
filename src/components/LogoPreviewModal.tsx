import React, { useEffect } from 'react';
import { X, Sparkles, Compass, ZoomIn } from 'lucide-react';

interface LogoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoSrc?: string;
}

export default function LogoPreviewModal({
  isOpen,
  onClose,
  logoSrc = '/assets/gis_logo_3d.png'
}: LogoPreviewModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 cursor-zoom-out select-none"
      title="Yopish uchun ekranning istalgan joyiga bosing"
      role="dialog"
      aria-modal="true"
    >
      {/* Ambient background glow effect */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-3xl pointer-events-none -translate-y-12" />

      {/* Close button at top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 shadow-xl transition-transform hover:scale-110 cursor-pointer"
        title="Yopish (Esc)"
        aria-label="Yopish"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Modal Content Container */}
      <div 
        onClick={onClose}
        className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-6 cursor-zoom-out"
      >
        {/* Large 3D Logo with transparent background and vibrant glow */}
        <div className="relative group transition-transform duration-300 hover:scale-105">
          <img
            src={logoSrc}
            alt="Hayitali G'ulomov 3D GIS Geotag Logo"
            className="w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] object-contain filter drop-shadow-[0_0_35px_rgba(16,185,129,0.65)] drop-shadow-[0_0_60px_rgba(6,182,212,0.4)] animate-in zoom-in-75 duration-300 select-none pointer-events-none"
          />
        </div>

        {/* Caption text */}
        <div className="space-y-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-mono font-bold tracking-wide shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Hayitali G'ulomov — 3D GIS & Geodeziya Logotipi</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Yopish va joyiga qaytarish uchun ekranning istalgan joyiga bosing
          </p>
        </div>
      </div>
    </div>
  );
}
