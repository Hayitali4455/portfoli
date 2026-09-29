import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  Compass, 
  Database, 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Award, 
  Workflow, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { GIS_SKILLS } from '../data/skills';
import skillsBgImage from '../assets/images/gis_skills_background_1790161215321.jpg';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    if (category.includes('GIS &')) return <Layers className="w-6 h-6 text-emerald-400" />;
    if (category.includes('Masofadan')) return <Sparkles className="w-6 h-6 text-cyan-400" />;
    if (category.includes('Geodasturlash')) return <Database className="w-6 h-6 text-purple-400" />;
    return <Compass className="w-6 h-6 text-amber-400" />;
  };

  const filteredCategories = activeCategory === 'all' 
    ? GIS_SKILLS 
    : GIS_SKILLS.filter((cat) => cat.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const totalSkills = GIS_SKILLS.flatMap((c) => c.skills).length;
  const avgProficiency = Math.round(
    GIS_SKILLS.flatMap((c) => c.skills).reduce((acc, curr) => acc + curr.level, 0) / totalSkills
  );

  return (
    <div 
      className={`fixed inset-0 z-50 flex animate-in fade-in duration-200 ${
        isFullscreen 
          ? 'w-screen h-screen p-0 bg-slate-950' 
          : 'items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md'
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 z-10" />

        {/* Futuristic Background Graphic Asset from Satellite & Topographic wireframe */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
          style={{ backgroundImage: `url(${skillsBgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 bg-slate-950/85 backdrop-blur-md shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Geofazoviy Ko'nikmalar & Dasturiy Salohiyat
                </h2>
                <span className="hidden sm:inline-flex items-center text-xs sm:text-sm font-mono font-semibold text-emerald-400">
                  • {isFullscreen ? "To'liq Ekran" : "Keng Oyna"} • {totalSkills} ta texnologiya
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 hidden xs:block mt-0.5">
                Desktop GIS, Masofadan Zondlash, Geoma'lumotlar bazasi va Python/GeoPandas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? "Oyna rejimiga qaytish" : "To'liq ekranga yoyish"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Oynani yopish"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Filter and Stats Bar */}
        <div className="relative z-10 px-6 sm:px-10 py-3.5 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Barcha Yo'nalishlar
            </button>
            <button
              onClick={() => setActiveCategory('GIS &')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === 'GIS &'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              GIS Dasturlari
            </button>
            <button
              onClick={() => setActiveCategory('Masofadan')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === 'Masofadan'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Masofadan Zondlash
            </button>
            <button
              onClick={() => setActiveCategory('Geodasturlash')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === 'Geodasturlash'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Python & Baza
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-mono">
            <span className="text-slate-300">
              O'rtacha daraja: <strong className="text-emerald-400 font-bold">{avgProficiency}%</strong>
            </span>
            <span className="text-slate-300">
              Tajriba: <strong className="text-cyan-400 font-bold">3+ yil</strong>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content - Spread across full width */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Skills Cards Grid - Wide Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
            {filteredCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 sm:p-7 shadow-xl transition-all duration-300 space-y-5"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {getCategoryIcon(cat.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {cat.category}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {cat.skills.length} ta asosiy asbob va instrument
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills with Progress */}
                <div className="space-y-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-slate-200">{skill.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">{skill.level}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 shadow-sm"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Practical Capabilities - Clean borderless typography spread wide */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-xl">
            <h4 className="text-base sm:text-lg font-bold text-white mb-6 flex items-center gap-2.5">
              <Workflow className="w-5 h-5 text-emerald-400" /> Amaliy GIS & Geodeziya Imkoniyatlari
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Kosmik tasvirlarni atmosferik va radiometrik korreksiya qilish (Sentinel-2, Landsat 8/9)</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Vektor va relyef tahlili: DEM, slope, aspect, gidrologik oqimlar modellashtirish</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Yer kadastri, chegaralar chegaralanishi va geodezik koordinata konvertatsiyasi (WGS84, Pulkovo 1942)</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">PostGIS fazoviy SQL so'rovlari: ST_Intersects, ST_Buffer, ST_Distance indeksatsiyasi</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">QGIS Python plaginlari, avtomatlashtirilgan kartografik atlaslar yaratish</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Veb-xaritalar (Leaflet, MapLibre, GeoServer) orqali interaktiv geoportallar ishlab chiqish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 py-4 bg-slate-950/90 flex items-center justify-between text-xs sm:text-sm text-slate-300 shrink-0 shadow-inner">
          <span>Mutaxassis: <strong className="text-white font-bold">G'ulomov Hayitali</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
