import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Layers, MapPin, Sparkles, RefreshCw, Compass, Maximize2, FileText, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { GISProject, ProjectCategory } from './types';
import { INITIAL_GIS_PROJECTS, getGisExperienceInfo } from './data/defaultProjects';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import AddProjectModal from './components/AddProjectModal';
import InteractiveMapViewer from './components/InteractiveMapViewer';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ResumeModal from './components/ResumeModal';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import ProjectsModal from './components/ProjectsModal';
import InteractiveMapModal from './components/InteractiveMapModal';
import SkillsModal from './components/SkillsModal';
import ExperienceModal from './components/ExperienceModal';
import AdminRequestsModal from './components/AdminRequestsModal';
import AdminEditToolbar from './components/AdminEditToolbar';
import AdminContentManagerModal from './components/AdminContentManagerModal';
import LogoPreviewModal from './components/LogoPreviewModal';
import ContactSection from './components/ContactSection';
import ChatbotWidget from './components/ChatbotWidget';
import ProjectsStatsChart from './components/ProjectsStatsChart';
import EditableText from './components/EditableText';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';

const STORAGE_KEY = 'hayitali_gis_projects_v6_clean';

export default function App() {
  const { user, isSiteEditor } = useAuth();
  const { t, getLocalizedProject, language } = useLanguage();

  // Load projects from localStorage or start empty []
  const [projects, setProjects] = useState<GISProject[]>(() => {
    try {
      // Clear legacy storage keys with old default maps
      ['hayitali_gis_projects_v5', 'hayitali_gis_projects_v4', 'hayitali_gis_projects_v3'].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load saved projects from localStorage", e);
    }
    return INITIAL_GIS_PROJECTS; // Empty array []
  });

  // Real-time synchronization with Firestore 'gis_projects' collection
  useEffect(() => {
    try {
      const projectsCol = collection(db, 'gis_projects');
      const unsubscribe = onSnapshot(
        projectsCol,
        (snapshot) => {
          const remoteList: GISProject[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push(docSnap.data() as GISProject);
          });
          remoteList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setProjects(remoteList);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteList));
          } catch {}
        },
        (err) => {
          console.warn("Notice: Firestore gis_projects sync fallback to local cache:", err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore listener init error:", e);
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  }, [projects]);

  // Compute Total Analyzed Area (Tahlil maydoni)
  const { totalAreaHectares, totalAreaText } = useMemo(() => {
    if (projects.length === 0) {
      return { totalAreaHectares: 0, totalAreaText: '0' };
    }

    let sum = 0;
    projects.forEach((p) => {
      const areaStr = p.datasetInfo?.areaSize || '';
      // Extract numbers (e.g. "45,200" or "14000")
      const clean = areaStr.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
      if (clean) {
        sum += parseFloat(clean[0]);
      }
    });

    if (sum === 0) {
      return { totalAreaHectares: 0, totalAreaText: '0' };
    }
    if (sum >= 1_000_000) {
      return { totalAreaHectares: sum, totalAreaText: `${(sum / 1_000_000).toFixed(1)}M+ Ga` };
    }
    if (sum >= 1_000) {
      return { totalAreaHectares: sum, totalAreaText: `${Math.round(sum).toLocaleString()}+ Ga` };
    }
    return { totalAreaHectares: sum, totalAreaText: `${Math.round(sum)} Ga` };
  }, [projects]);

  // Dynamic GIS Experience starting from June 24, 2023
  const gisExperienceInfo = useMemo(() => {
    return getGisExperienceInfo('2023-06-24');
  }, []);

  // Modal States
  const [selectedProjectForMap, setSelectedProjectForMap] = useState<GISProject | null>(null);
  const [modalProject, setModalProject] = useState<GISProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('register');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminRequestsModalOpen, setIsAdminRequestsModalOpen] = useState(false);
  const [isAdminContentManagerOpen, setIsAdminContentManagerOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Dedicated Window Modals for Navigation (Loyihalar, Xarita, Ko'nikmalar, Tajriba)
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('all');

  // All unique tools across current projects
  const allTools = useMemo(() => {
    const toolSet = new Set<string>();
    projects.forEach((p) => p.tools.forEach((t) => toolSet.add(t)));
    return Array.from(toolSet).sort();
  }, [projects]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'ai-arcgis-tools') {
          if (project.category !== 'ai-arcgis-tools' && project.category !== 'ai-tools' && project.category !== 'arcgis-tools') return false;
        } else if (activeCategory === 'ecology') {
          if (project.category !== 'ecology' && project.category !== 'hydrology-eco') return false;
        } else if (activeCategory === 'cadastre') {
          if (project.category !== 'cadastre' && project.category !== 'urban-cadastre') return false;
        } else if (project.category !== activeCategory) {
          return false;
        }
      }
      // Tool filter
      if (selectedTool !== 'all' && !project.tools.includes(selectedTool)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(query);
        const matchDesc = project.shortDescription.toLowerCase().includes(query) || project.fullDescription.toLowerCase().includes(query);
        const matchLocation = project.locationName.toLowerCase().includes(query);
        const matchTool = project.tools.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchDesc || matchLocation || matchTool;
      }
      return true;
    });
  }, [projects, activeCategory, selectedTool, searchQuery]);

  // Categories with counts
  const categoriesList: { id: ProjectCategory; label: string; count: number }[] = [
    { id: 'all', label: t('catAll'), count: projects.length },
    { id: 'agriculture', label: t('catAgriculture'), count: projects.filter(p => p.category === 'agriculture').length },
    { id: 'forestry', label: t('catForestry'), count: projects.filter(p => p.category === 'forestry').length },
    { id: 'ecology', label: t('catEcology'), count: projects.filter(p => p.category === 'ecology' || p.category === 'hydrology-eco').length },
    { id: 'cadastre', label: t('catCadastre'), count: projects.filter(p => p.category === 'cadastre' || p.category === 'urban-cadastre').length },
    { id: 'ai-arcgis-tools', label: t('catAiArcgisTools'), count: projects.filter(p => p.category === 'ai-arcgis-tools' || p.category === 'ai-tools' || p.category === 'arcgis-tools').length },
    { id: '3d-modeling', label: t('cat3dModeling'), count: projects.filter(p => p.category === '3d-modeling').length },
  ];

  // Add Project Handler (saves to Firestore and local state)
  const handleAddProject = async (newProj: GISProject) => {
    try {
      await setDoc(doc(db, 'gis_projects', newProj.id), newProj);
    } catch (err) {
      console.error("Failed to save project to Firestore:", err);
    }

    setProjects(prev => [newProj, ...prev]);
    setSelectedProjectForMap(newProj);
    // Smooth scroll to project card
    setTimeout(() => {
      const el = document.getElementById('projects-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Delete Project Handler
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gis_projects', id));
    } catch (err) {
      console.error("Failed to delete project from Firestore:", err);
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectForMap?.id === id) {
      setSelectedProjectForMap(null);
    }
  };

  const handleFocusOnMap = (project: GISProject) => {
    setSelectedProjectForMap(project);
    const mapEl = document.getElementById('map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hayitali-gis-portfolio-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportAllCSV = () => {
    try {
      const escapeCsv = (val: any): string => {
        if (val === null || val === undefined) return '""';
        let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        str = str.replace(/"/g, '""');
        return `"${str}"`;
      };

      const headers = [
        'project_id',
        'title',
        'category',
        'year',
        'location_name',
        'latitude',
        'longitude',
        'area_size',
        'scale',
        'crs',
        'data_format',
        'data_sources',
        'tools_used',
        'ai_framework',
        'ai_model_type',
        'ai_accuracy',
        'arcgis_toolbox',
        'short_description',
        'full_description',
        'task_description',
        'methodology_steps',
        'key_results',
        'has_geojson',
        'author',
        'exported_at'
      ];

      const rows = projects.map((p) => {
        const lp = getLocalizedProject(p);
        return [
          escapeCsv(lp.id),
          escapeCsv(lp.title),
          escapeCsv(lp.category),
          escapeCsv(lp.year),
          escapeCsv(lp.locationName),
          escapeCsv(lp.coordinates ? lp.coordinates[0] : ''),
          escapeCsv(lp.coordinates ? lp.coordinates[1] : ''),
          escapeCsv(lp.datasetInfo?.areaSize || ''),
          escapeCsv(lp.datasetInfo?.scale || ''),
          escapeCsv(lp.datasetInfo?.crs || ''),
          escapeCsv(lp.datasetInfo?.format || ''),
          escapeCsv(lp.datasetInfo?.dataSources || ''),
          escapeCsv(lp.tools?.join('; ') || ''),
          escapeCsv(lp.aiModelInfo?.framework || ''),
          escapeCsv(lp.aiModelInfo?.modelType || ''),
          escapeCsv(lp.aiModelInfo?.accuracy || ''),
          escapeCsv(lp.arcgisToolInfo?.toolboxType || ''),
          escapeCsv(lp.shortDescription || ''),
          escapeCsv(lp.fullDescription || ''),
          escapeCsv(lp.taskDescription || ''),
          escapeCsv(lp.methodology?.join('; ') || ''),
          escapeCsv(lp.results?.join('; ') || ''),
          escapeCsv(lp.geojsonSample ? 'Ha / Yes' : 'Yo\'q / No'),
          escapeCsv("Hayitali G'ulomov (GIS Mutaxassisi)"),
          escapeCsv(new Date().toISOString())
        ].join(',');
      });

      const csvString = '\uFEFF' + headers.join(',') + '\r\n' + rows.join('\r\n') + '\r\n';
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `barcha-gis-loyihalar-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export all CSV:', err);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setProjects(parsed);
            for (const item of parsed) {
              if (item.id) {
                try {
                  await setDoc(doc(db, 'gis_projects', item.id), item);
                } catch {}
              }
            }
            alert(`Muvaffaqiyatli yuklandi: ${parsed.length} ta loyiha!`);
          }
        } catch (err) {
          alert("Xato: Yaroqsiz JSON fayl.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Barcha xaritalarni tozalashni xohlaysizmi?")) {
      setProjects([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      {/* 1-rasm (Navbar) va 2-rasm (Hero) birlashtirilgan umumiy orqa fon maydoni */}
      <div className="relative overflow-hidden unified-gis-hero">
        {/* Full-bleed Satellite Topography Background spanning BOTH Navbar & Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-slate-950">
          <img
            src="/assets/gis_satellite_bg.jpg?v=3_nocords"
            alt="Geofazoviy Tahlil va Masofadan Zondlash Sun'iy Yo'ldosh Tasviri"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Pastki qismga (loyihalar blokiga) o'tuvchi mayin va silliq gradient */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        </div>

        {/* 1-rasmdagi joy: Navigation Bar - umumiy fon ustida bevosita joylashgan */}
        <Navbar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenAuthModal={(mode = 'register') => {
            setAuthModalInitialMode(mode);
            setIsAuthModalOpen(true);
          }}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onScrollToSection={handleScrollToSection}
          onOpenProjectsModal={() => setIsProjectsModalOpen(true)}
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenSkillsModal={() => setIsSkillsModalOpen(true)}
          onOpenExperienceModal={() => setIsExperienceModalOpen(true)}
          onOpenAdminRequestsModal={() => setIsAdminRequestsModalOpen(true)}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
        />

        {/* 2-rasmdagi joy: Hero Section - xuddi shu fon davomi sifatida joylashgan */}
        <Hero
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onExploreProjects={() => handleScrollToSection('projects-section')}
          onOpenMap={() => handleScrollToSection('map-section')}
          totalProjects={projects.length}
          totalAreaText={totalAreaText}
          gisExperienceText={gisExperienceInfo.formatted}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
        />
      </div>

      <main className="flex-1">
        {/* Section 1: Portfolio Projects Grid & Filters */}
        <section id="projects-section" className="relative py-16 sm:py-20 overflow-hidden bg-slate-950">
          {/* 2-rasmdagi yorug' relyef xaritasi orqa foni */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <img
              src="/assets/projects_topo_bg.jpg?v=1"
              alt="GIS Loyihalar relyef xaritasi foni"
              className="w-full h-full object-cover object-center opacity-95"
            />
            {/* Yuqori va pastki qismlarga o'tuvchi mayin va silliq gradient */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
          </div>

          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10 relative z-10">
            {/* Section Heading & Add Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase mb-3 drop-shadow">
                  <Layers className="w-4 h-4" /> Bajarilgan Geofazoviy Ishlar
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  <EditableText
                    contentKey="projects_section_title"
                    defaultValue="GIS & Kartografik Loyihalar"
                    label="Loyihalar sarlavhasi"
                  />
                </h2>
                <div className="mt-3 text-base sm:text-lg text-slate-200 font-medium max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] bg-slate-950/60 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg">
                  <EditableText
                    contentKey="projects_section_desc"
                    defaultValue="Har bir loyiha koordinata tizimi, qatlamlar tarkibi, metodologiya va interaktiv xarita qatlamlari bilan to'liq jihozlangan."
                    label="Loyihalar tavsifi"
                    multiline={true}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
                <button
                  onClick={() => setIsProjectsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md transition border border-slate-800"
                  title="Barcha loyihalarni alohida to'liq oynada ochish"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>Alohida Oynada Ochish</span>
                </button>

                {/* Add Project CTA Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Yangi GIS Loyihasi / Xarita</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl shadow-xl space-y-4 border border-slate-800">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-950/90 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Tool Dropdown Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {/* Search Input */}
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Qidiruv: QGIS, Sentinel-2, Toshkent, NDVI, Orol, Kadastr..."
                    className="w-full bg-slate-950/90 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none shadow-inner border border-slate-800"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Tozalash
                    </button>
                  )}
                </div>

                {/* Tool Selector Dropdown */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Filter className="w-4 h-4 text-cyan-400" /> Vosita:
                  </span>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full sm:w-56 bg-slate-950/90 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none shadow-inner border border-slate-800"
                  >
                    <option value="all">Barcha dasturlar</option>
                    {allTools.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recharts Data Visualization Panel (only if projects exist) */}
            {projects.length > 0 && (
              <ProjectsStatsChart
                projects={projects}
                activeCategory={activeCategory}
                onSelectCategory={(catId) => setActiveCategory(catId)}
              />
            )}

            {/* Projects Grid or Clean Empty State */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={getLocalizedProject(project)}
                    onSelect={handleFocusOnMap}
                    onViewDetails={(p) => setModalProject(p)}
                    onDelete={handleDeleteProject}
                    onRequireAuth={() => {
                      setAuthModalInitialMode('login');
                      setIsAuthModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : projects.length === 0 ? (
              /* Initial 0 Projects State as requested by user */
              <div className="text-center py-20 bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 sm:p-12 space-y-5 shadow-2xl border border-slate-800 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                  <Compass className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Hozircha tayyor xaritalar mavjud emas (0 ta)
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                    Sayt talabiga muvofiq barcha tayyor xaritalar tozalandi. Qachonki siz (Hayitali G'ulomov) yangi xarita yoki GIS tahlilini yuklasangiz, bosh sahifadagi hisoblagich hamda tahlil maydoni avtomatik o'zgaradi.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-xl shadow-emerald-500/30 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Birinchi Xaritani / GIS Loyihasini Yuklash</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/60 rounded-2xl p-8 space-y-3 shadow-xl">
                <Compass className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Mos loyihalar topilmadi</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedTool('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Interactive GIS Map Viewer */}
        <section id="map-section" className="py-16 sm:py-24 bg-slate-950 w-full">
          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 font-bold tracking-wider uppercase mb-3 drop-shadow">
                  <Compass className="w-4 h-4" /> Interaktiv Xaritalash Konsoli
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                  Geofazoviy Xarita va Qatlamlar Tahlilchisi
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed drop-shadow">
                  Sun'iy yo'ldosh (Esri Imagery), Relyef (OpenTopoMap) va qora GIS xaritalarida ob'ektlarni ko'ring.
                  Shuningdek, istalgan <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">.geojson</code> faylni xaritaga tashlab, darhol tahlil qilishingiz mumkin.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition shadow-md border border-slate-800"
                  title="Interaktiv xaritani alohida to'liq oynada ochish"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Alohida Oynada Ochish</span>
                </button>

                <div className="text-xs text-slate-400 font-mono bg-slate-900/90 px-3.5 py-2.5 rounded-xl flex items-center gap-2 shadow-md border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Faol qatlamlar: {projects.length} ta lokatsiya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-bleed Edge-to-Edge Map: spans 100% width and 85vh height covering the entire background */}
          <div className="w-full">
            <InteractiveMapViewer
              projects={projects}
              selectedProject={selectedProjectForMap}
              onSelectProject={(p) => setSelectedProjectForMap(p)}
              onOpenProjectModal={(p) => setModalProject(p)}
            />
          </div>
        </section>

        {/* Section 3: Technical Skills & Tools */}
        <SkillsSection onOpenModal={() => setIsSkillsModalOpen(true)} />

        {/* Section 4: Work Experience & Certifications */}
        <ExperienceSection onOpenModal={() => setIsExperienceModalOpen(true)} />

        {/* Section 5: Contact & Inquiries (Unified with Footer) */}
        <ContactSection
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetDefaults={handleResetDefaults}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onScrollToSection={handleScrollToSection}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          onExportAllCSV={handleExportAllCSV}
        />
      </main>

      {/* Modals */}
      <LogoPreviewModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      <ProjectModal
        project={modalProject ? getLocalizedProject(modalProject) : null}
        onClose={() => setModalProject(null)}
        onFocusOnMap={handleFocusOnMap}
        onDelete={handleDeleteProject}
        onOpenAuthModal={(mode) => {
          setAuthModalInitialMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <AdminRequestsModal
        isOpen={isAdminRequestsModalOpen}
        onClose={() => setIsAdminRequestsModalOpen(false)}
      />

      {/* Admin Content Manager Modal (All site texts in one place) */}
      <AdminContentManagerModal
        isOpen={isAdminContentManagerOpen}
        onClose={() => setIsAdminContentManagerOpen(false)}
      />

      {/* Dedicated Window Modals (Alohida Oynalar) */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={projects}
        onSelectProject={handleFocusOnMap}
        onViewDetails={(p) => setModalProject(p)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onRequireAuth={() => {
          setAuthModalInitialMode('login');
          setIsAuthModalOpen(true);
        }}
      />

      <InteractiveMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        projects={projects}
        selectedProject={selectedProjectForMap}
        onSelectProject={(p) => setSelectedProjectForMap(p)}
        onOpenProjectModal={(p) => setModalProject(p)}
      />

      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
      />

      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
      />

      {/* Floating Gemini AI GIS Chatbot Widget */}
      <ChatbotWidget />

      {/* Floating Superadmin Live Edit Toolbar for Hayitali G'ulomov */}
      <AdminEditToolbar
        onOpenContentManager={() => setIsAdminContentManagerOpen(true)}
        onOpenAddProject={() => setIsAddModalOpen(true)}
        totalProjects={projects.length}
      />
    </div>
  );
}
