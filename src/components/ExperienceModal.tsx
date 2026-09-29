import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Award, 
  Calendar, 
  MapPin, 
  Building, 
  ExternalLink, 
  CheckCircle2, 
  Download, 
  GraduationCap, 
  Sparkles, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { WORK_EXPERIENCE } from '../data/experience';
import experienceBgImage from '../assets/images/experience_gis_bg_1790161934528.jpg';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResumeModal: () => void;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  onOpenResumeModal
}: ExperienceModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(true);

  if (!isOpen) return null;

  const certifications = [
    {
      title: "ArcGIS Pro Associate & Spatial Analyst Professional",
      issuer: "Esri Certification",
      year: "2023",
      badge: "Esri Spatial Analyst",
      description: "Fazoviy modellashtirish, vektor va rastr geostatistika tahlillari bo'yicha xalqaro sertifikat."
    },
    {
      title: "Copernicus MOOC: Earth Observation & Sentinel Satellite Data",
      issuer: "European Space Agency (ESA)",
      year: "2022",
      badge: "Sentinel Remote Sensing",
      description: "Sentinel-1 (SAR) va Sentinel-2 (optik) kosmik sun'iy yo'ldosh monitoringi va tasvirlarni qayta ishlash."
    },
    {
      title: "Python for Geospatial Data Analysis (GeoPandas & Rasterio)",
      issuer: "GeoPython Institute",
      year: "2023",
      badge: "Python GIS",
      description: "Geoma'lumotlar ustida avtomatlashtirilgan fazoviy tahlil, Shapely, Rasterio va GeoPandas kutubxonalari."
    },
    {
      title: "Geodeziya va Kartografiyada GNSS RTK O'lchovlari",
      issuer: "Milliy Geodeziya Assotsiatsiyasi",
      year: "2021",
      badge: "GNSS / Geodesy",
      description: "Yuqori aniqlikdagi differensial GNSS qabul qilgichlar bilan fazoviy koordinata bog'lash va topografik suratga olish."
    }
  ];

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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 z-10" />

        {/* Futuristic Background Graphic Asset from Satellite & Topographic timeline wireframe */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
          style={{ backgroundImage: `url(${experienceBgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/20 to-slate-950/70 pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 bg-slate-950/85 backdrop-blur-md shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Ish Tajribasi va Sertifikatlar
                </h2>
                <span className="hidden sm:inline-flex items-center text-xs sm:text-sm font-mono font-semibold text-emerald-400">
                  • {isFullscreen ? "To'liq Ekran" : "Keng Oyna"} • 5+ Yillik Faoliyat
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 hidden xs:block mt-0.5">
                G'ulomov Hayitali — GIS muhandis, kartograf va masofadan zondlash mutaxassisi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenResumeModal();
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition backdrop-blur-sm shadow-md"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Rezyume</span>
            </button>

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

        {/* Modal Body (Scrollable) - Spread wide */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 w-full">
            {/* Work Experience Timeline (Left / Col 7) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <h3 className="text-sm sm:text-base font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-emerald-400" /> Mehnat Faoliyati Xronologiyasi
              </h3>

              <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {WORK_EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Dot without borders */}
                    <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 group-hover:scale-125 transition-transform" />

                    {/* Experience Card */}
                    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-7 sm:p-8 transition shadow-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                            {exp.role}
                          </h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 font-medium mt-1">
                            <Building className="w-4 h-4" />
                            <span>{exp.organization}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" /> {exp.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" /> {exp.location}
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-2 pt-2">
                        {exp.highlights.map((item: string, aIdx: number) => (
                          <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications and Education (Right / Col 5) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8">
              {/* Certifications */}
              <div className="space-y-5">
                <h3 className="text-sm sm:text-base font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-400" /> Xalqaro Sertifikatlar & Malaka
                </h3>

                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 transition shadow-xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                            {cert.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-amber-400 font-medium mt-1">
                            {cert.issuer}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-slate-400 shrink-0 font-medium">
                          {cert.year}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-5">
                <h3 className="text-sm sm:text-base font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-cyan-400" /> Oliy Ta'lim
                </h3>

                <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Geodeziya, Kartografiya va Geoinformatika (Bakalavr)
                      </h4>
                      <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-1">
                        Toshkent Arxitektura-Qurilish Universiteti / Milliy Universitet
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-slate-400 shrink-0 font-medium">
                      2018 - 2022
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Mutaxassislik: Fazoviy ma'lumotlar infratuzilmasi, yer kadastri va raqamli xaritalash uslublari.
                  </p>
                </div>
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
