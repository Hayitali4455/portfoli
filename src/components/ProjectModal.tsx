import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Layers, Database, CheckCircle2, Download, ExternalLink, 
  Cpu, Compass, Sparkles, Wrench, Code2, Copy, Check, Info, BookOpen, Terminal, 
  Trash2, Lock, LogIn, ShieldCheck, FileArchive, Clock, AlertCircle,
  Maximize2, Minimize2, FileSpreadsheet
} from 'lucide-react';
import { GISProject } from '../types';
import BeforeAfterSlider from './BeforeAfterSlider';
import { useAuth } from '../context/AuthContext';
import { useDownloadPermissions } from '../context/DownloadPermissionsContext';

interface ProjectModalProps {
  project: GISProject | null;
  onClose: () => void;
  onFocusOnMap: (project: GISProject) => void;
  onDelete?: (id: string) => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
}

export default function ProjectModal({
  project,
  onClose,
  onFocusOnMap,
  onDelete,
  onOpenAuthModal
}: ProjectModalProps) {
  const { user, userProfile } = useAuth();
  const { getPermissionStatus, requestPermission } = useDownloadPermissions();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isCsvExported, setIsCsvExported] = useState(false);

  if (!project) return null;

  const isAdmin = user?.email?.toLowerCase() === 'gulomovhayitali4455@gmail.com' || userProfile?.role === 'admin';
  const permissionStatus = getPermissionStatus(project.id);

  const handleExportCSV = () => {
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
    } catch (err) {
      console.error('Failed to export CSV from modal:', err);
    }
  };

  const downloadGeoJSON = () => {
    if (!project.geojsonSample) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project.geojsonSample, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.id}-geodata.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyCodeToClipboard = () => {
    if (!project.codeSnippet) return;
    navigator.clipboard.writeText(project.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRequestDownload = async () => {
    if (!user) {
      onOpenAuthModal?.('login');
      return;
    }
    setIsRequesting(true);
    setRequestFeedback(null);
    try {
      const res = await requestPermission(project.id, project.title);
      setRequestFeedback({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    } catch {
      setRequestFeedback({
        type: 'error',
        text: "So'rov yuborishda xatolik yuz berdi."
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDownloadProgram = () => {
    if (project.zipFile) {
      if (project.zipFile.dataUrl) {
        const a = document.createElement('a');
        a.href = project.zipFile.dataUrl;
        a.download = project.zipFile.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else if (project.downloadUrl) {
        window.open(project.downloadUrl, '_blank');
      } else {
        // Sample download
        const blob = new Blob([
          `Hayitali G'ulomov GIS & AI Portfolio\nLoyiha: ${project.title}\nID: ${project.id}\nYili: ${project.year}\n\nUshbu fayl admin ruxsati bilan yuklab olindi.`
        ], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = project.zipFile.name.endsWith('.zip') ? project.zipFile.name : `${project.zipFile.name}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } else if (project.downloadUrl) {
      window.open(project.downloadUrl, '_blank');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex animate-in fade-in duration-200 ${
        isFullscreen 
          ? 'w-screen h-screen p-0 bg-slate-950' 
          : 'items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <div 
        className={`relative flex flex-col bg-slate-900 shadow-2xl overflow-hidden transition-all duration-150 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'w-full max-w-6xl xl:max-w-7xl rounded-2xl my-auto max-h-[94vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4.5 bg-slate-900/95 sticky top-0 z-30 shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            {project.category === 'ai-arcgis-tools' || project.category === 'ai-tools' || project.category === 'arcgis-tools' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-purple-400 uppercase">
                <Sparkles className="w-4 h-4" /> AI Model & ArcGIS Pro Toolkit • {project.year}
              </span>
            ) : project.category === '3d-modeling' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-amber-400 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 3D Modellashtirish & Digital Twin • {project.year}
              </span>
            ) : project.category === 'agriculture' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-emerald-400 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Qishloq Xo'jaligi & NDVI • {project.year}
              </span>
            ) : project.category === 'forestry' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-teal-400 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> O'rmon Xo'jaligi & Monitoring • {project.year}
              </span>
            ) : project.category === 'ecology' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Ekologiya & Orolqum Tahlili • {project.year}
              </span>
            ) : project.category === 'cadastre' ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-semibold tracking-wider text-blue-400 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Shaharsozlik & Kadastr • {project.year}
              </span>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs sm:text-sm font-mono font-semibold tracking-wider text-emerald-400 uppercase">
                  GIS Loyiha Pasporti • {project.year}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`"${project.title}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
                    onDelete(project.id);
                    onClose();
                  }
                }}
                title="Loyihani o'chirish"
                className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">O'chirish</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? "Oyna rejimiga qaytish" : "To'liq ekranga yoyish"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Oynani yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Main Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-mono mb-2.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <MapPin className="w-4 h-4" /> {project.locationName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {project.year}
              </span>
              <span>•</span>
              <span className="text-slate-200 font-sans font-semibold">
                Koordinatalar: {project.coordinates[0].toFixed(4)}, {project.coordinates[1].toFixed(4)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              {project.title}
            </h1>
          </div>

          {/* Cover Image / BeforeAfter View */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[520px] shadow-2xl">
            {project.beforeAfter ? (
              <BeforeAfterSlider
                beforeImg={project.beforeAfter.beforeImg}
                afterImg={project.beforeAfter.afterImg}
                beforeLabel={project.beforeAfter.beforeLabel}
                afterLabel={project.beforeAfter.afterLabel}
              />
            ) : (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-80 sm:h-[460px] object-cover"
              />
            )}
          </div>

          {/* GUEST RESTRICTION: If user is not logged in, details are locked! */}
          {!user ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 text-center space-y-4 my-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-white">Loyiha Umumiy Ma'lumotlari Qulflangan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Loyiha haqidagi umumiy ma'lumotlar, uning vazifasi, texnologiyalar to'plami va dasturiy ta'minotini ko'rish uchun akkauntingiz bilan kiring yoki yangi akkaunt oching.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.('login');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Akkauntga Kirish / Ro'yxatdan o'tish</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOGGED-IN USERS: Full general info, task description, and downloads */
            <>
              {/* Task Description / Izoh Joyi */}
              {project.taskDescription && (
                <div className={`p-4 sm:p-5 rounded-2xl shadow-md ${
                  project.category === 'ai-tools'
                    ? 'bg-purple-950/25 text-purple-100'
                    : project.category === 'arcgis-tools'
                    ? 'bg-blue-950/25 text-blue-100'
                    : 'bg-emerald-950/25 text-emerald-100'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2 opacity-95">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Dastur / Tool Nima Vazifani Bajarishi (Batafsil Izoh):</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {project.taskDescription}
                  </p>
                </div>
              )}

              {/* General Description */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 space-y-2 shadow-md">
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Umumiy Tavsif
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {project.fullDescription || project.shortDescription}
                </p>
              </div>

              {/* ZIP File Program / Package Card with Permission Status */}
              {(project.zipFile || project.downloadUrl) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/20 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                        <FileArchive className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">
                            {project.zipFile?.name || `${project.title} (.ZIP Dastur)`}
                          </h4>
                          {project.zipFile?.size && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/30 text-purple-200">
                              {project.zipFile.size}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Ushbu dastur faqat admin (Hayitali G'ulomov) ruxsati bilan yuklab olinadi.
                        </p>
                      </div>
                    </div>

                    {/* Download button or Permission request */}
                    <div>
                      {isAdmin ? (
                        <button
                          onClick={handleDownloadProgram}
                          className="flex items-center gap-1.5 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-purple-600/30"
                        >
                          <Download className="w-4 h-4" />
                          <span>Yuklab olish (.ZIP) [Admin]</span>
                        </button>
                      ) : permissionStatus === 'approved' ? (
                        <button
                          onClick={handleDownloadProgram}
                          className="flex items-center gap-1.5 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Ruxsat berilgan — Yuklab olish (.ZIP)</span>
                        </button>
                      ) : permissionStatus === 'pending' ? (
                        <div className="flex items-center gap-2 py-2 px-3.5 bg-amber-500/10 rounded-xl text-xs text-amber-300 font-semibold shadow-xs">
                          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>Admin ruxsati kutilmoqda...</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleRequestDownload}
                          disabled={isRequesting}
                          className="flex items-center gap-1.5 py-2.5 px-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold rounded-xl text-xs transition shadow-sm"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>
                            {permissionStatus === 'rejected'
                              ? "Rad etilgan (Qayta so'rash)"
                              : "Yuklab olish uchun ruxsat so'rash"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {requestFeedback && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 shadow-xs ${
                      requestFeedback.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-red-500/10 text-red-300'
                    }`}>
                      <Info className="w-4 h-4 shrink-0" />
                      <span>{requestFeedback.text}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Technologies & Tools Stack */}
              <div>
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5" /> Texnologiyalar & Kutubxonalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-slate-800 text-cyan-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs"
                    >
                      <Cpu className="w-3 h-3 text-slate-400" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Snippet (if available) */}
              {project.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase text-purple-400 font-semibold tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" /> Dastur Kodi & Skript Namunasi
                    </h3>
                    <button
                      onClick={copyCodeToClipboard}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition shadow-xs"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Nusxalandi!" : "Nusxa olish"}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
                    <code>{project.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 flex-wrap">
            {/* CSV Eksport (Tahlilchilar uchun) */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition shadow-xs"
              title="Tahlilchilar uchun CSV jadval formatida yuklab olish (Excel, QGIS, ArcGIS)"
            >
              {isCsvExported ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isCsvExported ? "Yuklandi!" : "CSV Eksport"}</span>
            </button>

            {user && project.geojsonSample && (
              <button
                onClick={downloadGeoJSON}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Namuna GeoJSON</span>
              </button>
            )}

            {user && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`"${project.title}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
                    onDelete(project.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>O'chirish</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onFocusOnMap(project);
                onClose();
              }}
              className="flex items-center gap-1.5 py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Interaktiv Xaritada ochish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
