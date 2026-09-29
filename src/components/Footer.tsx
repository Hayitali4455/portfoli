import React from 'react';
import { Compass, Download, Upload, RefreshCw, Share2, FileSpreadsheet } from 'lucide-react';

export interface FooterProps {
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
  onOpenShareModal: () => void;
  onScrollToSection: (id: string) => void;
  onOpenLogoModal?: () => void;
  onExportAllCSV?: () => void;
}

export default function Footer({
  onExportData,
  onImportData,
  onResetDefaults,
  onOpenShareModal,
  onScrollToSection,
  onOpenLogoModal,
  onExportAllCSV
}: FooterProps) {
  return (
    <footer className="mt-16 sm:mt-20 pt-8 text-slate-400 text-xs">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={(e) => {
                if (onOpenLogoModal) {
                  e.stopPropagation();
                  onOpenLogoModal();
                }
              }}
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center transition-transform hover:scale-115 cursor-pointer"
              title="Logotipni katta ekranda ko'rish uchun bosing"
            >
              <img 
                src="/assets/gis_logo_3d.png" 
                alt="Hayitali G'ulomov 3D GIS Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(16,185,129,0.7)] select-none"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Hayitali G'ulomov</span>
              <p className="text-[11px] font-mono text-emerald-400">GIS & Geofazoviy Tahlillar Portfoliosi</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 font-medium">
            <button onClick={() => onScrollToSection('projects-section')} className="hover:text-emerald-400 transition">
              Loyihalar
            </button>
            <button onClick={() => onScrollToSection('map-section')} className="hover:text-emerald-400 transition">
              Interaktiv Xarita
            </button>
            <button onClick={() => onScrollToSection('skills-section')} className="hover:text-emerald-400 transition">
              Ko'nikmalar
            </button>
            <button onClick={() => onScrollToSection('experience-section')} className="hover:text-emerald-400 transition">
              Tajriba
            </button>
            <button onClick={() => onScrollToSection('contact-section')} className="hover:text-emerald-400 transition">
              Aloqa
            </button>
          </div>

          {/* Data Portability (Export/Import/Reset) & Share Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenShareModal}
              title="Boshqa kompyuterda ochish uchun havolani olish"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition text-[11px] font-medium backdrop-blur-sm shadow-sm"
            >
              <Share2 className="w-3 h-3" />
              <span>Havola / Ulashish</span>
            </button>

            {onExportAllCSV && (
              <button
                onClick={onExportAllCSV}
                title="Barcha loyihalarni CSV jadval formatida eksport qilish (Excel, QGIS, ArcGIS)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition text-[11px] font-medium backdrop-blur-sm shadow-sm"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                <span>CSV (Barchasi)</span>
              </button>
            )}

            <button
              onClick={onExportData}
              title="Barcha loyihalarni JSON formatida zaxiralash"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition text-[11px] backdrop-blur-sm shadow-sm"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>Eksport</span>
            </button>

            <label
              title="Zaxiradagi loyihalarni qayta yuklash"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition text-[11px] cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <Upload className="w-3 h-3 text-emerald-400" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={onImportData}
              />
            </label>

            <button
              onClick={onResetDefaults}
              title="Dastlabki namuna loyihalarni tiklash"
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition backdrop-blur-sm shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Technical CRS & Geodetic Footnote */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div>
            Koordinata Tizimi: <span className="text-slate-300">WGS-84 (EPSG:4326)</span> • Proyeksiya: <span className="text-slate-300">UTM Zone 42N (EPSG:32642)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>© {new Date().getFullYear()} Hayitali G'ulomov. Barcha huquqlar himoyalangan.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
