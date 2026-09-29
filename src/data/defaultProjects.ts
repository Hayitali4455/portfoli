import { GISProject, GISSkillCategory, WorkExperience } from '../types';

// Tayyor xaritalar hozircha 0 ta - faqat admin saytga yuklaganidan so'ng paydo bo'ladi
export const INITIAL_GIS_PROJECTS: GISProject[] = [];

export const GIS_SKILLS: GISSkillCategory[] = [
  {
    category: "Desktop & Professional GIS",
    skills: [
      { name: "ArcGIS Pro / ArcMap", level: 96 },
      { name: "QGIS Desktop & Plugins", level: 95 },
      { name: "Global Mapper", level: 88 },
      { name: "AutoCAD Map 3D", level: 85 }
    ]
  },
  {
    category: "Remote Sensing & Satellite Earth Observation",
    skills: [
      { name: "Google Earth Engine (GEE)", level: 92 },
      { name: "Sentinel-2 & Landsat Processing", level: 94 },
      { name: "SNAP (ESA Sentinel Application)", level: 86 },
      { name: "Agisoft Metashape (UAV Photogrammetry)", level: 90 }
    ]
  },
  {
    category: "Geoprogramming & Spatial Databases",
    skills: [
      { name: "Python / ArcPy & PyQGIS", level: 92 },
      { name: "PostgreSQL / PostGIS", level: 90 },
      { name: "GeoPandas, Shapely, Rasterio", level: 88 },
      { name: "Leaflet.js & Mapbox GL JS", level: 87 }
    ]
  },
  {
    category: "Standards, Cartography & Geodesy",
    skills: [
      { name: "GNSS / RTK High-Precision Survey", level: 93 },
      { name: "WGS-84, Pulkovo 1942, SK-42 Transformations", level: 95 },
      { name: "Cadastral Zoning & Topography", level: 94 },
      { name: "3D DEM/DSM Elevation Modeling", level: 91 }
    ]
  }
];

export function getGisExperienceInfo(startDateStr: string = '2023-06-24') {
  const start = new Date(startDateStr);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return {
    years,
    months,
    formatted: years > 0 ? `${years}+ Yil` : `${Math.max(1, months)} Oy`,
    fullDetail: `${years} yil${months > 0 ? `, ${months} oy` : ''}`,
    startDate: '2023-yil 24-iyun'
  };
}

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    role: "Bosh Geofazoviy Mutaxassis & GIS Loyiha Rahbari",
    organization: "Geofazoviy Axborot Texnologiyalari va Masofadan Zondlash Markazi",
    period: "2023-yil 24-iyun - Hozirgacha",
    location: "Toshkent shahri, O'zbekiston",
    highlights: [
      "Sentinel-2 va Landsat tasvirlari asosida O'zbekiston hududidagi suv havzalari va qishloq xo'jaligi maydonlarini avtomatlashgan monitoring tizimini yaratish",
      "ArcGIS Pro uchun ArcPy vositalari va Python Toolbox (.pyt) skriptlarini ishlab chiqish",
      "PostgreSQL/PostGIS korporativ geoma'lumotlar bazasini loyihalash va optimallashtirish",
      "Dron fotogrammetriyasi (Agisoft Metashape) yordamida 5 sm aniqlikdagi ortofotomozayka va DEM modellarini tayyorlash"
    ]
  }
];
