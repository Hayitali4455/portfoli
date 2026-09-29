import React, { useState } from 'react';
import { 
  ShieldCheck, Edit3, Eye, Settings, FileText, Check, Sparkles, RefreshCw, X, Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';

interface AdminEditToolbarProps {
  onOpenContentManager: () => void;
  onOpenAddProject: () => void;
  totalProjects: number;
}

export default function AdminEditToolbar({
  onOpenContentManager,
  onOpenAddProject,
  totalProjects
}: AdminEditToolbarProps) {
  const { user, isSiteEditor } = useAuth();
  const { isEditMode, toggleEditMode, isSaving } = useSiteContent();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isSiteEditor) return null;

  return (
    <aside 
      aria-label="Admin Boshqaruv Paneli"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 w-[95%] max-w-4xl"
    >
      <div className="bg-slate-950/95 border-2 border-emerald-500/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl text-white flex flex-wrap items-center justify-between gap-3 shadow-emerald-950/50">
        {/* Left: Identity info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/30">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                Hayitali G'ulomov
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Superadmin
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Saytdagi istalgan yozuv ustiga bosing — yozganingiz barcha akkauntlar uchun darhol saqlanadi
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          {isSaving && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Saqlanmoqda...</span>
            </div>
          )}

          {/* Toggle Live Edit Mode */}
          <button
            type="button"
            onClick={toggleEditMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              isEditMode
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-300'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isEditMode ? "Tahrirlash rejimi yoqilgan. Yozuvlar ustiga bosib o'zgartirishingiz mumkin" : "Tahrirlash rejimini yoqish"}
          >
            {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isEditMode ? "Tahrirlash: YOQILGAN" : "Ko'rish rejimi"}</span>
          </button>

          {/* Open Full Content Manager Modal */}
          <button
            type="button"
            onClick={onOpenContentManager}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            title="Barcha bo'limlar matnlarini yagona oynada ko'rish va tahrirlash"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Barcha Matnlar</span>
          </button>

          {/* Quick upload ready map */}
          <button
            type="button"
            onClick={onOpenAddProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/30"
            title="Yangi xarita yoki GIS tahlil loyihasini yuklash"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xarita yuklash ({totalProjects})</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
