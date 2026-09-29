import React from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe, Compass, CheckCircle2 } from 'lucide-react';
import { WORK_EXPERIENCE, GIS_SKILLS } from '../data/defaultProjects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900/95 sticky top-0 z-30 print:hidden shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase">
              Hayitali G'ulomov • GIS Mutaxassisi Rezyumesi (CV)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable CV Container */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-950 text-slate-200 font-sans print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-tight">
                  Hayitali G'ulomov
                </h1>
                <p className="text-emerald-400 print:text-emerald-700 font-mono font-semibold text-sm sm:text-base mt-1">
                  Katta GIS Mutaxassisi • Geofazoviy Tahlilchi & Kartograf
                </p>
              </div>

              {/* Contact Pills */}
              <div className="space-y-1.5 text-xs text-slate-300 print:text-gray-700 font-mono">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
                  <span>gulomovhayitali4455@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
                  <span>Toshkent, O'zbekiston</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
                  <span>Portfolio: ais-dev-cvtvskewg5uxnbuhvnojcr.run.app</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
              6 yildan ortiq davlat va xususiy geofazoviy loyihalarda faoliyat yuritgan tajribali GIS mutaxassisi.
              Sun'iy yo'ldosh multispektral tasvirlari monitoringi (Sentinel-2, Landsat), QGIS/ArcGIS Pro fazoviy modellashtirish,
              PostGIS relyatsion fazoviy ma'lumotlar bazasi hamda Google Earth Engine bulutli platformasi bo'yicha kuchli amaliy ko'nikmaga ega.
            </p>
          </div>

          {/* Core Technical Competencies */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 print:text-emerald-700 font-bold pb-1">
              Asosiy Texnik Ko'nikmalar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 print:bg-gray-100 p-3 rounded-xl shadow-inner">
                <span className="font-bold text-white print:text-black block mb-1">GIS & Kartografiya:</span>
                <span className="text-slate-300 print:text-gray-700">QGIS 3.34 LTR, ArcGIS Pro, ArcMap, AutoCAD Map 3D, Agisoft Metashape, SAGA GIS</span>
              </div>
              <div className="bg-slate-900/60 print:bg-gray-100 p-3 rounded-xl shadow-inner">
                <span className="font-bold text-white print:text-black block mb-1">Masofadan Zondlash (Remote Sensing):</span>
                <span className="text-slate-300 print:text-gray-700">Google Earth Engine (GEE), Sentinel-2, Landsat 8/9, NDVI, NDWI, LST, SRTM DEM</span>
              </div>
              <div className="bg-slate-900/60 print:bg-gray-100 p-3 rounded-xl shadow-inner">
                <span className="font-bold text-white print:text-black block mb-1">Dasturlash & Ma'lumotlar Bazasi:</span>
                <span className="text-slate-300 print:text-gray-700">Python (GeoPandas, Rasterio, Shapely), PostgreSQL/PostGIS, SQL, Leaflet, GeoJSON</span>
              </div>
              <div className="bg-slate-900/60 print:bg-gray-100 p-3 rounded-xl shadow-inner">
                <span className="font-bold text-white print:text-black block mb-1">Standartlar & Geodeziya:</span>
                <span className="text-slate-300 print:text-gray-700">WGS-84, Pulkovo 1942 (SK-42), UTM 41N/42N, GNSS RTK, Topologik Validatsiya</span>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 print:text-emerald-700 font-bold pb-1">
              Mehnat Faoliyati
            </h2>
            <div className="space-y-4">
              {WORK_EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-sm text-white print:text-black">{exp.role}</span>
                    <span className="text-xs font-mono text-emerald-400 print:text-emerald-700 font-semibold">{exp.period}</span>
                  </div>
                  <div className="text-xs text-slate-400 print:text-gray-600 font-mono">
                    {exp.organization} — {exp.location}
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 print:text-gray-700 space-y-1 pt-1">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-mono tracking-wider text-emerald-400 print:text-emerald-700 font-bold pb-1">
              Ta'lim va Mutaxassislik
            </h2>
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-white print:text-black">
                <span>Geodeziya, Kartografiya va Geoinformatika (Bakalavriat & Magistratura)</span>
                <span className="font-mono text-slate-400 print:text-gray-600">2014 - 2020</span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">
                O'zbekiston Milliy Universiteti / Toshkent Davlat Texnika Universiteti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
