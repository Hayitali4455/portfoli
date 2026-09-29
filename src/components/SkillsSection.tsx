import React from 'react';
import { Cpu, Satellite, Database, Compass, CheckCircle2, Maximize2 } from 'lucide-react';
import { GIS_SKILLS } from '../data/defaultProjects';
import skillsBgImage from '../assets/images/gis_skills_background_1790161215321.jpg';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './EditableText';

interface SkillsSectionProps {
  onOpenModal?: () => void;
}

export default function SkillsSection({ onOpenModal }: SkillsSectionProps) {
  const { t, getLocalizedSkillCategory } = useLanguage();

  const getCategoryIcon = (category: string) => {
    if (category.includes('Desktop')) return <Cpu className="w-6 h-6 sm:w-7 h-7 text-emerald-400" />;
    if (category.includes('Masofadan') || category.includes('Remote')) return <Satellite className="w-6 h-6 sm:w-7 h-7 text-cyan-400" />;
    if (category.includes('Geodasturlash') || category.includes('Python')) return <Database className="w-6 h-6 sm:w-7 h-7 text-purple-400" />;
    return <Compass className="w-6 h-6 sm:w-7 h-7 text-amber-400" />;
  };

  return (
    <section 
      id="skills-section" 
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-950 w-full"
    >
      {/* Background Graphic Asset from Satellite & Topographic wireframe */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none scale-[1.02] transform transition-transform duration-1000"
        style={{ backgroundImage: `url(${skillsBgImage})` }}
      />
      {/* High-tech Vignette & Gradients to guarantee high contrast and crisp typography */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />
      {/* Seamless blending gradients between sections */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />

      {/* Screen-spanning Wide Container */}
      <div className="relative z-10 w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase mb-4 drop-shadow">
            <Cpu className="w-4 h-4 sm:w-5 h-5" />
            <span>{t('skillsBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
            <EditableText
              contentKey="skills_section_title"
              defaultValue={t('skillsTitle') || "Geofazoviy Ko'nikmalar & Texnologiyalar"}
              label="Ko'nikmalar sarlavhasi"
            />
          </h2>
          <div className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed drop-shadow max-w-4xl mx-auto">
            <EditableText
              contentKey="skills_section_desc"
              defaultValue={t('skillsSubtitle') || "Desktop GIS, Masofadan zondlash, fazoviy ma'lumotlar bazalari va AI neyron tarmoqlaridan foydalanish bo'yicha amaliy tajribalar."}
              label="Ko'nikmalar tavsifi"
              multiline={true}
            />
          </div>

          {onOpenModal && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={onOpenModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 text-xs sm:text-sm font-semibold transition backdrop-blur-md shadow-lg hover:scale-105"
              >
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span>{t('skillsOpenModal')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Skills Grid - Wide Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
          {GIS_SKILLS.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-7 sm:p-9 transition-all duration-300 shadow-2xl hover:shadow-cyan-950/40 hover:bg-slate-900/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-7 pb-3">
                  <div className="shrink-0 p-1">
                    {getCategoryIcon(cat.category)}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                    {getLocalizedSkillCategory(cat.category)}
                  </h3>
                </div>

                <div className="space-y-6">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm sm:text-base">
                        <span className="font-semibold text-slate-100">{skill.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">{skill.level}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-950/90 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-700 shadow-sm"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Specialized Methods List - Wide Screen Spread */}
        <div className="mt-12 sm:mt-16 bg-slate-900/70 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl">
          <h4 className="text-sm sm:text-base font-mono uppercase text-emerald-400 font-bold tracking-wider mb-6 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t('skillsMethodsTitle')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 text-sm sm:text-base text-slate-200">
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod1')}</span>
            </div>
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod2')}</span>
            </div>
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod3')}</span>
            </div>
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod4')}</span>
            </div>
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod5')}</span>
            </div>
            <div className="flex items-center gap-3.5 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50"></span>
              <span className="font-medium">{t('skillsMethod6')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
