import React from 'react';
import { Briefcase, Award, GraduationCap, Calendar, MapPin, CheckCircle2, Maximize2 } from 'lucide-react';
import { WORK_EXPERIENCE } from '../data/defaultProjects';
import experienceBgImage from '../assets/images/experience_gis_bg_1790161934528.jpg';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './EditableText';

interface ExperienceSectionProps {
  onOpenModal?: () => void;
}

export default function ExperienceSection({ onOpenModal }: ExperienceSectionProps) {
  const { t, language } = useLanguage();

  const certifications = [
    {
      title: language === 'ru' 
        ? "Esri Certified GIS Professional (Пространственный анализ и моделирование)"
        : language === 'en'
        ? "Esri Certified GIS Professional (Spatial Analysis & Modeling)"
        : "Esri Certified GIS Professional (Spatial Analysis & Modeling)",
      issuer: "Esri Training",
      year: "2023",
      badge: "Esri Spatial Analyst"
    },
    {
      title: language === 'ru'
        ? "Copernicus MOOC: Дистанционное зондирование Земли и спутники Sentinel"
        : language === 'en'
        ? "Copernicus MOOC: Earth Observation & Sentinel Satellite Data"
        : "Copernicus MOOC: Earth Observation & Sentinel Satellite Data",
      issuer: "European Space Agency (ESA)",
      year: "2022",
      badge: "Sentinel Remote Sensing"
    },
    {
      title: language === 'ru'
        ? "Python для анализа геоданных (GeoPandas & Rasterio)"
        : language === 'en'
        ? "Python for Geospatial Data Analysis (GeoPandas & Rasterio)"
        : "Python for Geospatial Data Analysis (GeoPandas & Rasterio)",
      issuer: "GeoPython Institute",
      year: "2023",
      badge: "Python GIS"
    },
    {
      title: language === 'ru'
        ? "GNSS RTK измерения в геодезии и картографии"
        : language === 'en'
        ? "GNSS RTK High-Precision Surveying in Geodesy & Cartography"
        : "Geodeziya va Kartografiyada GNSS RTK O'lchovlari",
      issuer: language === 'ru' ? "Национальная геодезическая ассоциация" : language === 'en' ? "National Geodesy Association" : "Milliy Geodeziya Assotsiatsiyasi",
      year: "2021",
      badge: "GNSS / Geodesy"
    }
  ];

  // Localized work experience items
  const localizedWorkExperience = WORK_EXPERIENCE.map((exp, idx) => {
    if (language === 'ru') {
      if (idx === 0) {
        return {
          role: "Ведущий ГИС-специалист и пространственный аналитик",
          organization: "Центр геопространственной информации и кадастра",
          period: "24 июня 2023 г. - По настоящее время",
          location: "г. Ташкент, Узбекистан",
          highlights: [
            "Руководство 15+ крупными государственными и коммерческими ГИС-проектами в сфере сельского хозяйства и градостроительства",
            "Разработка системы космического мониторинга вегетации посевов (NDVI) на основе данных Sentinel-2 и Landsat",
            "Запуск веб-геопортала, объединяющего свыше 200,000 пространственных объектов с использованием PostGIS и GeoServer"
          ]
        };
      }
      if (idx === 1) {
        return {
          role: "Инженер-картограф ГИС",
          organization: "Проектный институт землеустройства и геодезии",
          period: "2020 - 2022",
          location: "г. Самарканд / Ташкент",
          highlights: [
            "Создание цифровых ортофотопланов масштаба 1:2000 для 30,000+ гектаров с помощью БПЛА (дроновой фотограмметрии)",
            "Векторизация и пространственный анализ почвенных бонитировочных и мелиоративных карт в среде QGIS и ArcGIS",
            "Координация результатов полевых спутниковых GNSS измерений между системами координат СК-42 и WGS-84"
          ]
        };
      }
      if (idx === 2) {
        return {
          role: "Младший ГИС-аналитик (Junior GIS Analyst)",
          organization: "Лаборатория экологического мониторинга и природных ресурсов",
          period: "2018 - 2020",
          location: "г. Ташкент",
          highlights: [
            "Первичная обработка спутниковых снимков для гидрологического мониторинга стоков и водохранилищ",
            "Участие в построении карт селе- и оползневой опасности горных районов на основе рельефа SRTM"
          ]
        };
      }
    }

    if (language === 'en') {
      if (idx === 0) {
        return {
          role: "Lead GIS Specialist & Spatial Data Analyst",
          organization: "Geospatial Information & Cadastre Center",
          period: "June 24, 2023 - Present",
          location: "Tashkent, Uzbekistan",
          highlights: [
            "Led 15+ major national and enterprise GIS projects in agricultural monitoring and urban planning",
            "Engineered satellite crop health tracking system (NDVI) using multi-temporal Sentinel-2 and Landsat imagery",
            "Deployed production Web-GIS geoportal integrating 200,000+ spatial assets via PostGIS and GeoServer"
          ]
        };
      }
      if (idx === 1) {
        return {
          role: "GIS Engineer & Digital Cartographer",
          organization: "Land Management & Geodetic Survey Institute",
          period: "2020 - 2022",
          location: "Samarkand / Tashkent",
          highlights: [
            "Generated high-resolution 1:2000 digital orthomosaics covering 30,000+ hectares via UAV drone photogrammetry",
            "Vectorized soil bonitation and melioration spatial layers within QGIS and ArcGIS environments",
            "Harmonized ground GNSS RTK survey checkpoints across SK-42 (Pulkovo 1942) and WGS-84 coordinate systems"
          ]
        };
      }
      if (idx === 2) {
        return {
          role: "Junior GIS Analyst",
          organization: "Environmental Monitoring & Natural Resources Laboratory",
          period: "2018 - 2020",
          location: "Tashkent",
          highlights: [
            "Satellite imagery pre-processing for hydrological river discharge and reservoir capacity monitoring",
            "Contributed to flash flood and landslide susceptibility hazard modeling based on SRTM digital elevation data"
          ]
        };
      }
    }

    return exp;
  });

  return (
    <section 
      id="experience-section" 
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-950 w-full"
    >
      {/* Background Graphic Asset from Satellite & Topographic timeline wireframe */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 pointer-events-none scale-[1.02] transform transition-transform duration-1000"
        style={{ backgroundImage: `url(${experienceBgImage})` }}
      />
      {/* High-tech Vignette & Gradients to guarantee high contrast and crisp typography */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />
      {/* Seamless blending gradients between sections */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />

      {/* Screen-spanning Wide Container */}
      <div className="relative z-10 w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase mb-4 drop-shadow">
            <Briefcase className="w-4 h-4 sm:w-5 h-5" />
            <span>{t('expBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
            <EditableText
              contentKey="experience_section_title"
              defaultValue={t('expTitle') || "Professional Tajriba & Faoliyat"}
              label="Ish tajribasi bo'limi sarlavhasi"
            />
          </h2>
          <div className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed drop-shadow max-w-4xl mx-auto">
            <EditableText
              contentKey="experience_section_desc"
              defaultValue={t('expSubtitle') || "2023-yil 24-iyundan boshlab geofazoviy texnologiyalar va masofadan zondlash sohasidagi amaliy faoliyat."}
              label="Ish tajribasi tavsifi"
              multiline={true}
            />
          </div>

          {onOpenModal && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={onOpenModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-400 text-xs sm:text-sm font-semibold transition backdrop-blur-md shadow-lg hover:scale-105"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>{t('expOpenModal')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Wide Layout: 7 Cols Left / 5 Cols Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Work Experience Timeline (7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <h3 className="text-base sm:text-lg font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5 mb-6 drop-shadow">
              <Briefcase className="w-5 h-5 text-emerald-400" /> {t('expTimelineTitle')}
            </h3>

            <div className="relative pl-8 sm:pl-10 space-y-10 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {localizedWorkExperience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot without borders */}
                  <div className="absolute -left-8 sm:-left-10 top-2 w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60 group-hover:scale-125 transition-transform" />

                  <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:bg-slate-900/80">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.role}
                      </h4>
                      <span className="flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-semibold">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mb-5 font-mono">
                      <span className="font-semibold text-slate-100">{exp.organization}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        {exp.location}
                      </span>
                    </div>

                    <ul className="space-y-3 text-sm sm:text-base text-slate-200">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications & Education (5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-10">
            {/* Certifications */}
            <div>
              <h3 className="text-base sm:text-lg font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5 mb-6 drop-shadow">
                <Award className="w-5 h-5 text-cyan-400" /> {t('expCertsTitle')}
              </h3>

              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 backdrop-blur-xl transition-all duration-300 shadow-xl group hover:bg-slate-900/80"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                      <span className="font-medium">{cert.issuer}</span>
                      <span className="text-slate-400">{cert.year}</span>
                    </div>
                    <h5 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {cert.title}
                    </h5>
                    <div className="mt-3 text-xs sm:text-sm font-mono text-emerald-400 font-semibold">
                      {cert.badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-base sm:text-lg font-mono uppercase text-slate-200 font-bold tracking-wider flex items-center gap-2.5 mb-6 drop-shadow">
                <GraduationCap className="w-5 h-5 text-purple-400" /> {t('expEduTitle')}
              </h3>

              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 backdrop-blur-xl shadow-xl">
                <span className="text-xs font-mono text-purple-400 block mb-2 font-semibold">
                  {t('expEduDegree')}
                </span>
                <h5 className="font-bold text-base sm:text-lg text-white leading-snug">
                  {t('expEduMajor')}
                </h5>
                <p className="text-sm text-slate-200 mt-2">
                  {t('expEduUniv')}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-3">
                  {t('expEduSpec')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
