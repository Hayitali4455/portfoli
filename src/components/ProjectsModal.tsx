import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Layers, 
  MapPin, 
  Calendar, 
  Plus, 
  ExternalLink,
  Cpu,
  Sparkles,
  Maximize2,
  Minimize2,
  BarChart3
} from 'lucide-react';
import { GISProject, ProjectCategory } from '../types';
import ProjectCard from './ProjectCard';
import ProjectsStatsChart from './ProjectsStatsChart';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GISProject[];
  onSelectProject: (project: GISProject) => void;
  onViewDetails: (project: GISProject) => void;
  onOpenAddModal: () => void;
  onDeleteProject?: (id: string) => void;
  onRequireAuth?: () => void;
}

export default function ProjectsModal({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onViewDetails,
  onOpenAddModal,
  onDeleteProject,
  onRequireAuth
}: ProjectsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('all');
  const { t, getLocalizedProject, language } = useLanguage();

  if (!isOpen) return null;

  // Extract unique tools
  const allTools = Array.from(new Set(projects.flatMap((p) => p.tools || []))).sort();

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = 
      activeCategory === 'all' || 
      p.category === activeCategory ||
      (activeCategory === 'ai-arcgis-tools' && (p.category === 'ai-tools' || p.category === 'arcgis-tools')) ||
      (activeCategory === 'ecology' && p.category === 'hydrology-eco') ||
      (activeCategory === 'cadastre' && p.category === 'urban-cadastre');

    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tools && p.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTool = selectedTool === 'all' || (p.tools && p.tools.includes(selectedTool));

    return matchesCategory && matchesSearch && matchesTool;
  });

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: t('catAll') },
    { id: 'agriculture', label: t('catAgriculture') },
    { id: 'forestry', label: t('catForestry') },
    { id: 'ecology', label: t('catEcology') },
    { id: 'cadastre', label: t('catCadastre') },
    { id: 'ai-arcgis-tools', label: t('catAiArcgisTools') },
    { id: '3d-modeling', label: t('cat3dModeling') },
  ];

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
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 bg-slate-950/90 shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {language === 'ru' ? 'ГИС-портфолио и геопространственные проекты' : language === 'en' ? 'GIS Portfolio & Geospatial Projects' : 'GIS Portfel & Geofazoviy Loyihalar'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {projects.length} {language === 'ru' ? 'проектов' : language === 'en' ? 'projects' : 'loyiha'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ru' ? '6 основных направлений: с/х, лесное хозяйство, экология, кадастр, ИИ/ArcGIS Pro и 3D' : language === 'en' ? '6 key directions: Agriculture, Forestry, Ecology, Cadastre, AI & ArcGIS Pro, and 3D Modeling' : '6 ta asosiy yo\'nalish: qishloq xo\'jaligi, o\'rmon xo\'jaligi, ekologiya, kadastr, AI/ArcGIS Pro va 3D modellashtirish'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">{t('projectsAddBtn')}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow-sm"
              title={isFullscreen ? "Oyna rejimiga o'tish" : "To'liq ekranga yoyish"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow-sm"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 sm:px-10 py-3.5 bg-slate-900/90 border-b border-slate-800/80 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('projectsSearchPlaceholder')}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tool Filter & Analytics Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> {t('projectsToolLabel')}
              </span>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 min-w-[140px]"
              >
                <option value="all">{t('projectsAllTools')}</option>
                {allTools.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowChart(!showChart)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border shrink-0 ${
                  showChart
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={language === 'ru' ? 'Визуализация данных Recharts' : language === 'en' ? 'Recharts Data Visualization' : 'Recharts statistik diagrammasi'}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">
                  {language === 'ru' ? 'Диаграмма' : language === 'en' ? 'Analytics' : 'Diagramma'}
                </span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? projects.length 
                : projects.filter(p => {
                    if (cat.id === 'ai-arcgis-tools') return p.category === 'ai-arcgis-tools' || p.category === 'ai-tools' || p.category === 'arcgis-tools';
                    if (cat.id === 'ecology') return p.category === 'ecology' || p.category === 'hydrology-eco';
                    if (cat.id === 'cadastre') return p.category === 'cadastre' || p.category === 'urban-cadastre';
                    return p.category === cat.id;
                  }).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activeCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 shadow-xs'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeCategory === cat.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 relative bg-slate-950">
          {/* Topographic Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <img
              src="/assets/projects_topo_bg.jpg?v=1"
              alt="GIS Topography Background"
              className="w-full h-full object-cover object-center opacity-95"
            />
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
          </div>

          <div className="relative z-10">
            {showChart && (
              <div className="mb-6 animate-in fade-in duration-300">
                <ProjectsStatsChart
                  projects={projects}
                  activeCategory={activeCategory}
                  onSelectCategory={(catId) => setActiveCategory(catId)}
                />
              </div>
            )}

            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/70 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-lg mx-auto">
                <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-slate-300 font-semibold">{t('projectsNotFound')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('projectsNotFoundDesc')}</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedTool('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-semibold transition"
                >
                  {t('projectsClearFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={getLocalizedProject(project)}
                    onSelect={(p) => {
                      onSelectProject(p);
                      onClose();
                    }}
                    onViewDetails={(p) => {
                      onViewDetails(p);
                    }}
                    onDelete={onDeleteProject}
                    onRequireAuth={() => {
                      onClose();
                      onRequireAuth?.();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 py-3.5 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400 shrink-0 shadow-inner">
          <span>
            {language === 'ru' ? 'Всего проектов:' : language === 'en' ? 'Total projects:' : 'Jami loyihalar:'}{' '}
            <strong className="text-white">{projects.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {language === 'ru' ? 'Закрыть' : language === 'en' ? 'Close' : 'Yopish'}
          </button>
        </div>
      </div>
    </div>
  );
}
