import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Eye, 
  Trash2, 
  Cpu, 
  FileText, 
  Sparkles, 
  Wrench, 
  Terminal, 
  Info, 
  Lock, 
  LogIn,
  Sprout,
  Trees,
  Droplets,
  Building2,
  Box,
  Layers,
  Download,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { GISProject } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProjectCardProps {
  project: GISProject;
  onSelect: (project: GISProject) => void;
  onViewDetails: (project: GISProject) => void;
  onDelete?: (id: string) => void;
  onRequireAuth?: () => void;
  onExportProject?: (project: GISProject) => void;
}

export default function ProjectCard({
  project,
  onSelect,
  onViewDetails,
  onDelete,
  onRequireAuth,
  onExportProject
}: ProjectCardProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [isJsonExported, setIsJsonExported] = useState(false);
  const [isCsvExported, setIsCsvExported] = useState(false);

  // CSV Export for GIS analysts, researchers, and data engineers
  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // RFC 4180 CSV value escaping
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

      const row = [
        escapeCsv(project.id),
        escapeCsv(project.title),
        escapeCsv(project.category),
        escapeCsv(project.year),
        escapeCsv(project.locationName),
        escapeCsv(project.coordinates ? project.coordinates[0] : ''),
        escapeCsv(project.coordinates ? project.coordinates[1] : ''),
        escapeCsv(project.datasetInfo?.areaSize || ''),
        escapeCsv(project.datasetInfo?.scale || ''),
        escapeCsv(project.datasetInfo?.crs || ''),
        escapeCsv(project.datasetInfo?.format || ''),
        escapeCsv(project.datasetInfo?.dataSources || ''),
        escapeCsv(project.tools?.join('; ') || ''),
        escapeCsv(project.aiModelInfo?.framework || ''),
        escapeCsv(project.aiModelInfo?.modelType || ''),
        escapeCsv(project.aiModelInfo?.accuracy || ''),
        escapeCsv(project.arcgisToolInfo?.toolboxType || ''),
        escapeCsv(project.shortDescription || ''),
        escapeCsv(project.fullDescription || ''),
        escapeCsv(project.taskDescription || ''),
        escapeCsv(project.methodology?.join('; ') || ''),
        escapeCsv(project.results?.join('; ') || ''),
        escapeCsv(project.geojsonSample ? 'Ha / Yes' : 'Yo\'q / No'),
        escapeCsv("Hayitali G'ulomov (GIS Mutaxassisi)"),
        escapeCsv(new Date().toISOString())
      ];

      // Prepend UTF-8 BOM (\uFEFF) so Excel, QGIS & Calc properly decode Uzbek Latin & Cyrillic characters
      const csvString = '\uFEFF' + headers.join(',') + '\r\n' + row.join(',') + '\r\n';

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (project.title || project.id)
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .slice(0, 32);
      link.download = `${project.id}_${safeTitle}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsCsvExported(true);
      setTimeout(() => setIsCsvExported(false), 2200);

      if (onExportProject) {
        onExportProject(project);
      }
    } catch (err) {
      console.error('Failed to export project CSV:', err);
    }
  };

  const handleExportJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const exportData = {
        projectMeta: {
          author: "Hayitali G'ulomov",
          role: "GIS & Remote Sensing Specialist",
          exportedAt: new Date().toISOString(),
          schemaVersion: "1.0-gis-project",
          exportFormat: "JSON"
        },
        project: {
          id: project.id,
          title: project.title,
          category: project.category,
          year: project.year,
          locationName: project.locationName,
          coordinates: project.coordinates,
          shortDescription: project.shortDescription,
          fullDescription: project.fullDescription,
          taskDescription: project.taskDescription || null,
          tools: project.tools,
          datasetInfo: project.datasetInfo || null,
          aiModelInfo: project.aiModelInfo || null,
          arcgisToolInfo: project.arcgisToolInfo || null,
          methodology: project.methodology || [],
          results: project.results || [],
          codeSnippet: project.codeSnippet || null,
          geojsonSample: project.geojsonSample || null,
          imageUrl: project.imageUrl,
          additionalImages: project.additionalImages || [],
          createdAt: project.createdAt || new Date().toISOString()
        }
      };

      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      const url = URL.createObjectURL(jsonBlob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (project.title || project.id)
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .slice(0, 32);
      link.download = `${project.id}_${safeTitle}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsJsonExported(true);
      setTimeout(() => setIsJsonExported(false), 2200);

      if (onExportProject) {
        onExportProject(project);
      }
    } catch (err) {
      console.error('Failed to export project JSON:', err);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'agriculture':
        return { 
          label: language === 'ru' ? "1. Сельское хозяйство" : language === 'en' ? "1. Agriculture" : "1. Qishloq xo'jaligi", 
          class: 'bg-emerald-500/25 text-emerald-300 shadow-sm shadow-emerald-500/10',
          icon: Sprout
        };
      case 'forestry':
        return { 
          label: language === 'ru' ? "2. Лесное хозяйство" : language === 'en' ? "2. Forestry" : "2. O'rmon xo'jaligi", 
          class: 'bg-teal-500/25 text-teal-300 shadow-sm shadow-teal-500/10',
          icon: Trees
        };
      case 'ecology':
      case 'hydrology-eco':
        return { 
          label: language === 'ru' ? "3. Экология" : language === 'en' ? "3. Ecology" : "3. Ekologiya", 
          class: 'bg-cyan-500/25 text-cyan-300 shadow-sm shadow-cyan-500/10',
          icon: Droplets
        };
      case 'cadastre':
      case 'urban-cadastre':
        return { 
          label: language === 'ru' ? "4. Кадастр" : language === 'en' ? "4. Cadastre" : "4. Kadastr", 
          class: 'bg-blue-500/25 text-blue-300 shadow-sm shadow-blue-500/10',
          icon: Building2
        };
      case 'ai-arcgis-tools':
      case 'ai-tools':
      case 'arcgis-tools':
        return { 
          label: language === 'ru' ? "5. ИИ и инструменты ArcGIS Pro" : language === 'en' ? "5. AI & ArcGIS Pro Tools" : "5. AI & ArcGIS Pro Tools", 
          class: 'bg-purple-500/25 text-purple-300 shadow-sm shadow-purple-500/10',
          icon: Sparkles
        };
      case '3d-modeling':
        return { 
          label: language === 'ru' ? "6. 3D Моделирование" : language === 'en' ? "6. 3D Modeling" : "6. 3D Modellashtirish", 
          class: 'bg-amber-500/25 text-amber-300 shadow-sm shadow-amber-500/10',
          icon: Box
        };
      default:
        return { 
          label: language === 'ru' ? 'ГИС Проект' : language === 'en' ? 'GIS Project' : 'GIS Loyiha', 
          class: 'bg-slate-500/20 text-slate-300',
          icon: Layers
        };
    }
  };

  const badge = getCategoryBadge(project.category);
  const BadgeIcon = badge.icon;

  return (
    <div
      id={`project-card-${project.id}`}
      className="group relative flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-900"
    >
      {/* Thumbnail Section */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Category Pill Top-Left */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${badge.class}`}>
            {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
            {badge.label}
          </span>
        </div>

        {/* Year Pill Top-Right */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-950/70 text-slate-300 backdrop-blur-md shadow-sm">
            <Calendar className="w-3 h-3 text-cyan-400" />
            {project.year}
          </span>
        </div>

        {/* Coordinates Pill Bottom-Left */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{project.coordinates[0].toFixed(2)}°N, {project.coordinates[1].toFixed(2)}°E</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Location Name */}
          <div className="text-xs font-medium text-emerald-400 mb-1.5 line-clamp-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{project.locationName}</span>
          </div>

          {/* Project Title */}
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {project.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
            {project.shortDescription}
          </p>

          {/* Program/Tool specific details if present */}
          {(project.isProgram || project.programVersion || project.taskDescription) && (
            <div className="mb-3 p-2.5 rounded-xl bg-slate-950/70 space-y-1.5">
              {project.programVersion && (
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-cyan-400" /> Versiya:
                  </span>
                  <span className="text-cyan-300 font-semibold">{project.programVersion}</span>
                </div>
              )}
              {project.taskDescription && (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>{language === 'ru' ? 'Назначение:' : language === 'en' ? 'Task & Purpose:' : 'Vazifasi & Izoh:'}</span>
                  </div>
                  <p className="line-clamp-2 text-slate-300 leading-normal text-[11px]">
                    {project.taskDescription.replace(/^Dasturning asosiy vazifasi:\s*|^Toolning asosiy vazifasi:\s*/i, '')}
                  </p>
                </div>
              )}

              {/* Tools stack */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tools.slice(0, 4).map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Cpu className="w-2.5 h-2.5 text-slate-400" />
                    {tool}
                  </span>
                ))}
                {project.tools.length > 4 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{project.tools.length - 4} {language === 'ru' ? 'еще' : language === 'en' ? 'more' : 'yana'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* 1. Xaritada ko'rish tugmasi */}
          <button
            onClick={() => onSelect(project)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition shadow-sm border border-slate-700/50 hover:border-slate-600"
            title={t('cardFocusMap')}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{t('cardFocusMap')}</span>
          </button>

          {/* 2. CSV Eksport (Tahlilchilar, Excel va QGIS uchun) */}
          <button
            onClick={handleExportCSV}
            title={language === 'ru' ? 'Скачать данные в CSV (Excel, QGIS, ArcGIS)' : language === 'en' ? 'Download project CSV (Excel, QGIS, ArcGIS)' : 'Tahlilchilar uchun CSV formatida yuklab olish (Excel, QGIS, ArcGIS)'}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-2.5 rounded-xl text-xs font-semibold transition shadow-sm border ${
              isCsvExported
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 border-emerald-500/30 hover:border-emerald-400/50 shadow-emerald-950/30'
            }`}
          >
            {isCsvExported ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">
              {isCsvExported ? (language === 'ru' ? 'Готово!' : language === 'en' ? 'Done!' : 'Yuklandi!') : 'CSV'}
            </span>
          </button>

          {/* 3. JSON Eksport tugmasi */}
          <button
            onClick={handleExportJSON}
            title={language === 'ru' ? 'Скачать данные проекта в JSON' : language === 'en' ? 'Download project data in JSON format' : 'Loyiha ma\'lumotlarini JSON formatida yuklab olish'}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-2.5 rounded-xl text-xs font-semibold transition shadow-sm border ${
              isJsonExported
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
                : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 border-cyan-500/30 hover:border-cyan-400/50 shadow-cyan-950/30'
            }`}
          >
            {isJsonExported ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
            ) : (
              <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <span className="truncate">
              {isJsonExported ? (language === 'ru' ? 'Готово!' : language === 'en' ? 'Done!' : 'Yuklandi!') : 'JSON'}
            </span>
          </button>

          {/* 3. Batafsil ma'lumot tugmasi */}
          <button
            onClick={() => {
              if (!user && onRequireAuth) {
                onRequireAuth();
              } else {
                onViewDetails(project);
              }
            }}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-2.5 font-bold rounded-xl text-xs transition shadow-md ${
              project.category === 'ai-tools' || project.category === 'ai-arcgis-tools'
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                : project.category === 'arcgis-tools'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {!user
                ? language === 'ru' ? 'Вход' : language === 'en' ? 'Login' : 'Kirish'
                : t('cardViewDetails')}
            </span>
          </button>

          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(language === 'ru' ? `Удалить проект "${project.title}"?` : language === 'en' ? `Delete project "${project.title}"?` : `"${project.title}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
                  onDelete(project.id);
                }
              }}
              title={language === 'ru' ? 'Удалить проект' : language === 'en' ? 'Delete project' : 'Loyihani o\'chirish'}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
