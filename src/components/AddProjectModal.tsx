import React, { useState } from 'react';
import { 
  X, Upload, Plus, Trash2, MapPin, Layers, Cpu, Check, AlertCircle, 
  FileText, CheckCircle2, Sparkles, Compass, Wrench, Code2, Download, 
  ExternalLink, Info, BookOpen, ShieldCheck, FileArchive, ChevronDown, ChevronUp,
  Maximize2, Minimize2
} from 'lucide-react';
import { GISProject, ProjectCategory, ZipFileInfo } from '../types';
import { parseGISFile } from '../utils/gisParsers';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: GISProject) => void;
}

const SAMPLE_MAP_IMAGES = [
  { label: 'AI Neyron Tahlili & Kosmik', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sun\'iy yo\'ldosh tasviri', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80' },
  { label: 'ArcGIS Pro Kod & Muhandislik', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Topografik & Relyef', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' }
];

export default function AddProjectModal({ isOpen, onClose, onAddProject }: AddProjectModalProps) {
  // Simplified vs Advanced mode
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Core essential fields (Minimum required)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<ProjectCategory, 'all'>>('ai-tools');
  const [generalDescription, setGeneralDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_MAP_IMAGES[0].url);
  const [areaSizeInput, setAreaSizeInput] = useState('');
  const [crsInput, setCrsInput] = useState('');

  // ZIP File upload state
  const [zipFile, setZipFile] = useState<ZipFileInfo | null>(null);
  const [isReadingZip, setIsReadingZip] = useState(false);

  // Optional Advanced Fields
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [year, setYear] = useState('2024');
  const [locationName, setLocationName] = useState('O\'zbekiston');
  const [selectedTools, setSelectedTools] = useState<string[]>(['PyTorch', 'YOLOv8', 'Python (GeoPandas)']);
  const [customToolInput, setCustomToolInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleToolToggle = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleAddCustomTool = () => {
    if (!customToolInput.trim()) return;
    if (!selectedTools.includes(customToolInput.trim())) {
      setSelectedTools([...selectedTools, customToolInput.trim()]);
    }
    setCustomToolInput('');
  };

  // ZIP File Upload Handler (.zip, .rar, .7z)
  const handleZipFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsReadingZip(true);
      setErrorMsg('');

      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${(file.size / 1024).toFixed(1)} KB`;

      const reader = new FileReader();
      reader.onload = (event) => {
        setZipFile({
          name: file.name,
          size: sizeStr,
          dataUrl: (event.target?.result as string) || undefined,
          uploadedAt: new Date().toISOString()
        });
        setIsReadingZip(false);

        // Auto set title if empty
        if (!title.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      };
      reader.onerror = () => {
        setIsReadingZip(false);
        setErrorMsg("Arxiv faylni o'qishda xatolik yuz berdi.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Cover Image upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyAITemplate = () => {
    setCategory('ai-tools');
    setTitle("GeoAI - Sun'iy Yo'ldosh Tasvirlaridan Binolarni Aniqlash Moduli");
    setGeneralDescription("Ushbu sun'iy intellekt moduli kosmik va dron ortofotomozaykalaridan yangi binolar, yo'llar va noqonuniy qurilishlarni YOLOv8 va PyTorch yordamida avtomatik ajratib oladi va GeoJSON formatida tayyor qatlam yaratadi.");
    setImageUrl(SAMPLE_MAP_IMAGES[0].url);
    setSelectedTools(['PyTorch', 'YOLOv8', 'Python (GeoPandas)', 'OpenCV']);
  };

  const applyArcGISTemplate = () => {
    setCategory('arcgis-tools');
    setTitle("ArcGIS Pro Avtomatlashtirilgan Topologik Tahlil Vositalari (.pyt)");
    setGeneralDescription("ArcGIS Pro 3.x uchun maxsus ArcPy vositasi bo'lib, kadastr qatlamlaridagi topologik xatoliklarni avtomatik tuzatadi, koordinatalarni qayta hisoblaydi va yakuniy fazoviy hisobotlarni tayyorlaydi.");
    setImageUrl(SAMPLE_MAP_IMAGES[2].url);
    setSelectedTools(['ArcGIS Pro', 'ArcPy', 'Python', 'PostgreSQL']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Iltimos, dastur yoki modul nomini kiriting.");
      return;
    }
    if (!generalDescription.trim()) {
      setErrorMsg("Iltimos, dastur haqidagi umumiy ma'lumot va vazifasini kiriting.");
      return;
    }

    const newProject: GISProject = {
      id: `custom-project-${Date.now()}`,
      title: title.trim(),
      category: category,
      shortDescription: generalDescription.length > 140 ? generalDescription.slice(0, 137) + '...' : generalDescription,
      fullDescription: generalDescription.trim(),
      taskDescription: generalDescription.trim(),
      imageUrl: imageUrl,
      year: year || '2024',
      locationName: locationName || "O'zbekiston",
      coordinates: [41.2995, 69.2401],
      tools: selectedTools.length > 0 ? selectedTools : ['Python', 'GIS', 'AI'],
      datasetInfo: {
        areaSize: areaSizeInput.trim() ? (areaSizeInput.toLowerCase().includes('ga') || areaSizeInput.toLowerCase().includes('gektar') ? areaSizeInput.trim() : `${areaSizeInput.trim()} gektar`) : undefined,
        crs: crsInput.trim() || 'EPSG:32642 (UTM Zone 42N / WGS-84)'
      },
      methodology: [
        "Vazifa va kiruvchi fazoviy ma'lumotlarni qabul qilish",
        "Algoritm va neyron to'r modellarini qo'llash",
        "Natijalarni eksport qilish va tekshirish"
      ],
      githubUrl: githubUrl.trim() || undefined,
      downloadUrl: downloadUrl.trim() || undefined,
      zipFile: zipFile || undefined,
      requiresAdminPermission: true,
      createdAt: new Date().toISOString()
    };

    onAddProject(newProject);
    onClose();
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
            : 'w-full max-w-2xl rounded-2xl my-auto max-h-[92vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-slate-900/95 sticky top-0 z-20 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Modul & Dastur Joylash</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300">
                  Tezkor kiritish
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kam va oddiy maydonlar orqali dastur ma'lumotlari va .zip arxivini biriktirish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 rounded-xl flex items-center gap-2.5 text-xs text-red-300 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Template Selector */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950/60 rounded-xl flex-wrap shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Tayyor shablon:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyAITemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sun'iy Intellekt (AI)</span>
              </button>
              <button
                type="button"
                onClick={applyArcGISTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>ArcGIS Pro Tool</span>
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Yo'nalish / Kategoriya <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('agriculture')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === 'agriculture'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>1. Qishloq xo'jaligi</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('forestry')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === 'forestry'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>2. O'rmon xo'jaligi</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('ecology')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === 'ecology'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>3. Ekologiya</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('cadastre')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === 'cadastre'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>4. Kadastr</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('ai-arcgis-tools')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === 'ai-arcgis-tools' || category === 'ai-tools' || category === 'arcgis-tools'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>5. AI & ArcGIS Pro</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('3d-modeling')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === '3d-modeling'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>6. 3D Modeling</span>
              </button>
            </div>
          </div>

          {/* 1. Project / Module Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Dastur yoki Modul Nomi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: GeoAI - Dron tasvirlaridan binolarni avtomatik aniqlash dasturi"
              className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition shadow-inner"
            />
          </div>

          {/* 2. General Information & Task Description (Single comprehensive field) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Umumiy Ma'lumot va Vazifasi <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Qisqa va tushunarli</span>
            </div>
            <textarea
              required
              rows={4}
              value={generalDescription}
              onChange={(e) => setGeneralDescription(e.target.value)}
              placeholder="Dastur nima vazifani bajaradi? Masalan: Ushbu AI modul kosmik yoki dron tasvirlarini tahlil qilib, yangi qurilgan binolarni va noqonuniy yer o'zlashtirishlarni avtomatik aniqlaydi va tayyor qatlam yaratib beradi..."
              className="w-full bg-slate-950 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition leading-relaxed shadow-inner"
            />
          </div>

          {/* 2.5 Tahlil qilingan maydon va Koordinata tizimi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-wider">
                Tahlil Maydoni (Gektar / ga)
              </label>
              <input
                type="text"
                value={areaSizeInput}
                onChange={(e) => setAreaSizeInput(e.target.value)}
                placeholder="Masalan: 45,000 gektar yoki 12000"
                className="w-full bg-slate-900 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Bosh sahifadagi umumiy tahlil maydoni hisobiga qo'shiladi</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5 uppercase tracking-wider">
                Koordinata Tizimi (CRS)
              </label>
              <input
                type="text"
                value={crsInput}
                onChange={(e) => setCrsInput(e.target.value)}
                placeholder="Masalan: EPSG:32642 (UTM 42N) / WGS-84"
                className="w-full bg-slate-900 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Xarita yoki dastur ishlatadigan koordinata tizimi</p>
            </div>
          </div>

          {/* 3. ZIP File Upload (Dastur arxivini joylash) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileArchive className="w-4 h-4 text-purple-400" />
                <span>Dasturning .ZIP Arxiv Fayli</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">.zip, .rar, .7z</span>
            </div>

            <div className="relative rounded-xl p-4 text-center transition bg-purple-950/20 shadow-inner">
              <input
                type="file"
                accept=".zip,.rar,.7z,.tar,.gz,.tar.gz"
                onChange={handleZipFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {zipFile ? (
                <div className="flex items-center justify-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate max-w-xs">{zipFile.name}</p>
                    <p className="text-xs text-emerald-400 font-mono">{zipFile.size} • Arxiv biriktirildi</p>
                  </div>
                </div>
              ) : isReadingZip ? (
                <div className="text-xs text-purple-300 animate-pulse">
                  Fayl yuklanmoqda va o'qilmoqda...
                </div>
              ) : (
                <div className="space-y-1">
                  <FileArchive className="w-8 h-8 text-purple-400 mx-auto mb-1 opacity-75" />
                  <p className="text-xs font-semibold text-white">Dastur arxivini (.zip) tanlang yoki bu yerga tashlang</p>
                  <p className="text-[11px] text-slate-400">Kodlar, o'rgatilgan model fayllari yoki o'rnatuvchi paket</p>
                </div>
              )}
            </div>

            {/* Security Notice regarding Admin Approval */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-400 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Xavfsizlik & Mualliflik himoyasi:</strong> Ushbu .zip dasturini tashrif buyuruvchilar faqatgina sizning (admin) ruxsatingiz bilan yuklab olishlari mumkin bo'ladi.
              </span>
            </div>
          </div>

          {/* 4. Cover Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Muqova Rasmi (Ixtiyoriy)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {SAMPLE_MAP_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative h-20 rounded-xl overflow-hidden transition ${
                    imageUrl === img.url ? 'ring-2 ring-purple-500 shadow-md shadow-purple-500/30' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-white p-1 truncate text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-950 hover:bg-slate-800 rounded-xl text-xs text-slate-300 cursor-pointer transition shadow-xs">
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>O'z kompyuteringizdan rasm yuklash</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 5. Optional Advanced Settings (Accordion) */}
          <div className="rounded-xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3 bg-slate-950/50 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-400" />
                <span>Qo'shimcha ma'lumotlar (GitHub, havola, yili) - Ixtiyoriy</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 bg-slate-950/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GitHub Repozitoriy havolasi</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tashqi yuklab olish havolasi (URL)</label>
                    <input
                      type="url"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Yil</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Hudud / Joylashuv</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full bg-slate-900 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900/95 py-2 shadow-md">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30 hover:scale-[1.02]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Dastur / Modulni Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
