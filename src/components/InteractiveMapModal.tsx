import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2,
  MapPin, 
  ExternalLink, 
  Info
} from 'lucide-react';
import { GISProject } from '../types';
import InteractiveMapViewer from './InteractiveMapViewer';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GISProject[];
  selectedProject: GISProject | null;
  onSelectProject: (project: GISProject) => void;
  onOpenProjectModal: (project: GISProject) => void;
}

export default function InteractiveMapModal({
  isOpen,
  onClose,
  projects,
  selectedProject,
  onSelectProject,
  onOpenProjectModal
}: InteractiveMapModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex animate-in fade-in duration-200 ${
        isFullscreen 
          ? 'w-screen h-screen p-0 bg-slate-950' 
          : 'items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md'
      }`}
    >
      <div 
        className={`relative flex flex-col bg-slate-900 shadow-2xl overflow-hidden text-slate-100 transition-all duration-150 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'w-full max-w-[96vw] xl:max-w-[1700px] h-[94vh] rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-4.5 bg-slate-950/90 shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Interaktiv GIS Xarita Maydoni
                </h2>
                <span className="hidden sm:inline-flex items-center text-xs sm:text-sm font-mono font-semibold text-emerald-400">
                  • {isFullscreen ? "To'liq Ekran" : "Keng Oyna"} • Leaflet & WebGIS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 hidden xs:block mt-0.5">
                Fazoviy qatlamlar (Shapefile, KML, GeoJSON), sun'iy yo'ldosh tasvirlari va koordinatalar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? "Oyna rejimiga qaytish" : "To'liq ekranga yoyish"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Oynani yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Viewer Container */}
        <div className="flex-1 overflow-hidden relative bg-slate-950">
          <InteractiveMapViewer
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
            onOpenProjectModal={onOpenProjectModal}
            isInsideModal={true}
          />
        </div>
      </div>
    </div>
  );
}
