import React from 'react';
import { Compass, Map, Plus, ChevronRight, Layers, Satellite, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './EditableText';

interface HeroProps {
  onOpenAddModal: () => void;
  onExploreProjects: () => void;
  onOpenMap: () => void;
  totalProjects: number;
  totalAreaText: string;
  gisExperienceText: string;
  onOpenLogoModal?: () => void;
}

export default function Hero({
  onOpenAddModal,
  onExploreProjects,
  onOpenMap,
  totalProjects,
  totalAreaText,
  gisExperienceText,
  onOpenLogoModal
}: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 min-h-[600px] flex flex-col justify-center w-full">
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Top Pill */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/85 backdrop-blur-md shadow-xl border border-emerald-500/30 shadow-emerald-500/10">
            <img 
              onClick={(e) => {
                if (onOpenLogoModal) {
                  e.stopPropagation();
                  onOpenLogoModal();
                }
              }}
              src="/assets/gis_logo_3d.png" 
              alt="GIS 3D Logo" 
              className="w-5 h-5 object-contain filter drop-shadow-[0_0_6px_rgba(16,185,129,0.7)] cursor-pointer hover:scale-125 transition-transform select-none" 
              title="Logotipni katta ekranda ko'rish uchun bosing"
            />
            <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase">
              <EditableText
                contentKey="hero_badge"
                defaultValue={t('heroBadge') || "GEOFARMATIKA VA GEOFATOVIY TAHLIL"}
                label="Bosh sahifa nishoni"
              />
            </span>
          </div>
        </div>

        {/* Main Display Headline with clear backdrop readability */}
        <div className="text-center max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            <EditableText
              contentKey="hero_title_1"
              defaultValue={t('heroTitle1') || "Geofazoviy Axborot Tizimlari va"}
              label="Bosh sarlavha 1-qism"
            />{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              <EditableText
                contentKey="hero_title_highlight"
                defaultValue={t('heroTitleHighlight') || "Masofadan Zondlash"}
                label="Bosh sarlavha rangli ajratmasi"
              />
            </span>{' '}
            <EditableText
              contentKey="hero_title_2"
              defaultValue={t('heroTitle2') || "Bo'yicha Professional Loyihalar"}
              label="Bosh sarlavha 2-qism"
            />
          </h1>

          <div className="text-base sm:text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-slate-950/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl">
            <EditableText
              contentKey="hero_description"
              defaultValue={t('heroDescription') || "Sentinel-2, Landsat, Dron fotogrammetriyasi, ArcGIS Pro, QGIS, GEE va sun'iy intellekt (AI) modellariga asoslangan geofazoviy tahlillar, raqamli xaritalar hamda mualliflik dasturlari."}
              label="Bosh sahifa tavsif matni"
              multiline={true}
            />
          </div>

          {/* Action Button Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreProjects}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition shadow-2xl shadow-emerald-500/30 hover:scale-105"
            >
              <Layers className="w-5 h-5" />
              <span>
                <EditableText
                  contentKey="hero_btn_explore"
                  defaultValue={t('heroBtnExplore') || "Loyihalarni Ko'rish"}
                  label="Loyihalar tugmasi"
                />
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenMap}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-2xl transition hover:scale-105 border border-slate-700/60"
            >
              <Map className="w-5 h-5 text-cyan-400" />
              <span>
                <EditableText
                  contentKey="hero_btn_map"
                  defaultValue={t('heroBtnMap') || "Interaktiv Xarita"}
                  label="Xarita tugmasi"
                />
              </span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 font-semibold text-sm sm:text-base backdrop-blur-md shadow-2xl transition hover:scale-105 border border-emerald-500/30"
            >
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>
                <EditableText
                  contentKey="hero_btn_add"
                  defaultValue={t('heroBtnAdd') || "Dastur / Xarita Joylash"}
                  label="Xarita/Dastur qo'shish tugmasi"
                />
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid with Glassmorphic contrast */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
          {/* Stat 1: Ready Maps / Projects */}
          <div className="bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-2xl transition hover:bg-slate-900/80 group border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                <EditableText
                  contentKey="stat_maps_label"
                  defaultValue={t('heroStatMaps') || "XARITALAR & LOYIHALAR"}
                  label="1-statistika nomi"
                />
              </span>
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            {/* Exactly 0 when no maps uploaded, or actual count if uploaded */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {totalProjects === 0 ? '0' : `${totalProjects}+`}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1.5">
              <EditableText
                contentKey="stat_maps_sub"
                defaultValue={totalProjects === 0 ? "Hozircha xarita yuklanmagan (0 ta)" : t('heroStatMapsSub')}
                label="1-statistika izohi"
              />
            </div>
          </div>

          {/* Stat 2: Analyzed Area */}
          <div className="bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-2xl transition hover:bg-slate-900/80 group border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                <EditableText
                  contentKey="stat_area_label"
                  defaultValue={t('heroStatArea') || "TAHLIL QILINGAN MAYDON"}
                  label="2-statistika nomi (Maydon)"
                />
              </span>
              <Satellite className="w-5 h-5 text-cyan-400" />
            </div>
            {/* 0 when no maps, or calculated from uploaded maps */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {totalAreaText}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1.5">
              <EditableText
                contentKey="stat_area_sub"
                defaultValue={totalProjects === 0 ? "Xarita yuklanmaguncha 0 ga" : t('heroStatAreaSub')}
                label="2-statistika izohi"
              />
            </div>
          </div>

          {/* Stat 3: GIS Experience starting from 2023-06-24 */}
          <div className="bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-2xl transition hover:bg-slate-900/80 group border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                <EditableText
                  contentKey="stat_exp_label"
                  defaultValue={t('heroStatExp') || "GIS TAJRIBA"}
                  label="3-statistika nomi (Tajriba)"
                />
              </span>
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            {/* Dynamically calculated from 2023-06-24 */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {gisExperienceText}
            </div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1.5">
              <EditableText
                contentKey="stat_exp_sub"
                defaultValue="2023-yil 24-iyundan boshlab"
                label="3-statistika izohi"
              />
            </div>
          </div>

          {/* Stat 4: Coordinate Reference System */}
          <div className="bg-slate-950/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-2xl transition hover:bg-slate-900/80 group border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                <EditableText
                  contentKey="stat_crs_label"
                  defaultValue={t('heroStatCrs') || "KOORDINATA TIZIMI"}
                  label="4-statistika nomi"
                />
              </span>
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              <EditableText
                contentKey="stat_crs_val"
                defaultValue="EPSG/UTM"
                label="4-statistika qiymati"
              />
            </div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1.5">
              <EditableText
                contentKey="stat_crs_sub"
                defaultValue={t('heroStatCrsSub') || "WGS-84 va Pulkovo 1942"}
                label="4-statistika izohi"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack Chips Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-6xl mx-auto">
          {['QGIS', 'ArcGIS Pro', 'Google Earth Engine', 'PostGIS', 'Python / GeoPandas', 'Sentinel-2', 'Landsat 8/9', 'AutoCAD Map 3D', 'Leaflet / WebGIS', 'Geoserver'].map((tech, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs sm:text-sm font-mono text-slate-300 shadow-md hover:text-emerald-400 transition cursor-default border border-slate-800/60"
            >
              #{tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
