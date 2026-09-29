import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Wrench, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Filter
} from 'lucide-react';
import { GISProject, ProjectCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsStatsChartProps {
  projects: GISProject[];
  activeCategory: ProjectCategory;
  onSelectCategory: (categoryId: ProjectCategory) => void;
}

export default function ProjectsStatsChart({
  projects,
  activeCategory,
  onSelectCategory
}: ProjectsStatsChartProps) {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'category' | 'tools'>('category');
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [isExpanded, setIsExpanded] = useState(true);

  // Category Colors
  const CATEGORY_COLORS: Record<string, string> = {
    agriculture: '#10b981', // emerald-500
    forestry: '#14b8a6',    // teal-500
    ecology: '#06b6d4',     // cyan-500
    cadastre: '#3b82f6',    // blue-500
    'ai-arcgis-tools': '#a855f7', // purple-500
    'ai-tools': '#a855f7',
    'arcgis-tools': '#8b5cf6',
    '3d-modeling': '#f59e0b', // amber-500
    default: '#64748b'
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'agriculture':
        return language === 'ru' ? 'С/х' : language === 'en' ? 'Agri' : 'Qishloq xo\'j.';
      case 'forestry':
        return language === 'ru' ? 'Лес' : language === 'en' ? 'Forestry' : 'O\'rmon xo\'j.';
      case 'ecology':
        return language === 'ru' ? 'Экология' : language === 'en' ? 'Ecology' : 'Ekologiya';
      case 'cadastre':
        return language === 'ru' ? 'Кадастр' : language === 'en' ? 'Cadastre' : 'Kadastr';
      case 'ai-arcgis-tools':
      case 'ai-tools':
      case 'arcgis-tools':
        return language === 'ru' ? 'GeoAI & Tools' : language === 'en' ? 'GeoAI & Tools' : 'GeoAI & Tools';
      case '3d-modeling':
        return language === 'ru' ? '3D Модель' : language === 'en' ? '3D Model' : '3D Model';
      default:
        return cat;
    }
  };

  const getCategoryFullName = (cat: string) => {
    switch (cat) {
      case 'agriculture':
        return language === 'ru' ? '1. Сельское хозяйство' : language === 'en' ? '1. Agriculture' : '1. Qishloq xo\'jaligi';
      case 'forestry':
        return language === 'ru' ? '2. Лесное хозяйство' : language === 'en' ? '2. Forestry' : '2. O\'rmon xo\'jaligi';
      case 'ecology':
        return language === 'ru' ? '3. Экология' : language === 'en' ? '3. Ecology' : '3. Ekologiya';
      case 'cadastre':
        return language === 'ru' ? '4. Кадастр' : language === 'en' ? '4. Cadastre' : '4. Kadastr';
      case 'ai-arcgis-tools':
      case 'ai-tools':
      case 'arcgis-tools':
        return language === 'ru' ? '5. ИИ и инструменты ArcGIS' : language === 'en' ? '5. AI & ArcGIS Tools' : '5. AI & ArcGIS Tools';
      case '3d-modeling':
        return language === 'ru' ? '6. 3D Моделирование' : language === 'en' ? '6. 3D Modeling' : '6. 3D Modellashtirish';
      default:
        return cat;
    }
  };

  // 1. Category Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      agriculture: 0,
      forestry: 0,
      ecology: 0,
      cadastre: 0,
      'ai-arcgis-tools': 0,
      '3d-modeling': 0
    };

    projects.forEach(p => {
      let key = p.category;
      if (key === 'ai-tools' || key === 'arcgis-tools') key = 'ai-arcgis-tools';
      if (counts[key] !== undefined) {
        counts[key] += 1;
      } else {
        counts[key] = 1;
      }
    });

    return Object.entries(counts).map(([catKey, count]) => ({
      key: catKey as ProjectCategory,
      name: getCategoryName(catKey),
      fullName: getCategoryFullName(catKey),
      count,
      fill: CATEGORY_COLORS[catKey] || CATEGORY_COLORS.default
    }));
  }, [projects, language]);

  // 2. Tool Data (Top 7 most used tools)
  const toolData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      p.tools.forEach(tool => {
        const cleanTool = tool.trim();
        counts[cleanTool] = (counts[cleanTool] || 0) + 1;
      });
    });

    const TOOL_PALETTE = [
      '#06b6d4', // cyan-500
      '#10b981', // emerald-500
      '#a855f7', // purple-500
      '#3b82f6', // blue-500
      '#f59e0b', // amber-500
      '#ec4899', // pink-500
      '#14b8a6'  // teal-500
    ];

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([toolName, count], idx) => ({
        name: toolName,
        count,
        fill: TOOL_PALETTE[idx % TOOL_PALETTE.length]
      }));
  }, [projects]);

  const totalProjects = projects.length;
  const topTool = toolData[0]?.name || 'ArcGIS Pro';

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.fill }}
            />
            <span>{data.fullName || data.name}</span>
          </div>
          <div className="mt-1 text-slate-300 font-mono text-[11px] flex items-center justify-between gap-3">
            <span>{language === 'ru' ? 'Количество:' : language === 'en' ? 'Count:' : 'Loyihalar soni:'}</span>
            <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
              {data.count} {language === 'ru' ? 'проект.' : language === 'en' ? 'proj.' : 'ta'}
            </span>
          </div>
          {data.key && (
            <div className="mt-1 text-[10px] text-emerald-400 font-medium">
              {language === 'ru' ? 'Нажмите для фильтрации' : language === 'en' ? 'Click to filter' : 'Filtrlash uchun bosing'}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-xl transition-all duration-200">
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {language === 'ru' ? 'Статистика портфолио' : language === 'en' ? 'Portfolio Data Analytics' : 'Loyihalar Vizual Tahlili'}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Recharts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {viewMode === 'category'
                ? language === 'ru' ? 'Распределение по 6 направлениям' : language === 'en' ? 'Distribution across 6 domains' : '6 ta asosiy yo\'nalish taqsimoti'
                : language === 'ru' ? 'Частота использования ГИС-инструментов' : language === 'en' ? 'GIS tool & software usage frequency' : 'Eng ko\'p qo\'llanilgan GIS dasturlari'}
            </p>
          </div>
        </div>

        {/* View Controls & Collapse */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Switch: Category vs Tools */}
          <div className="bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('category')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'category'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{language === 'ru' ? 'Категории' : language === 'en' ? 'Categories' : 'Kategoriyalar'}</span>
            </button>

            <button
              onClick={() => setViewMode('tools')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'tools'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>{language === 'ru' ? 'Инструменты' : language === 'en' ? 'Tools' : 'Vositalar'}</span>
            </button>
          </div>

          {/* Switch: Bar vs Donut */}
          <div className="bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setChartType('bar')}
              title={language === 'ru' ? 'Гистограмма' : language === 'en' ? 'Bar Chart' : 'Ustunli diagramma'}
              className={`p-1.5 rounded-lg transition ${
                chartType === 'bar'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('donut')}
              title={language === 'ru' ? 'Круговая диаграмма' : language === 'en' ? 'Donut Chart' : 'Aylana diagramma'}
              className={`p-1.5 rounded-lg transition ${
                chartType === 'donut'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Yig\'ish' : 'Kengaytirish'}
            className="p-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Chart Body */}
      {isExpanded && (
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Chart Display Area */}
          <div className="lg:col-span-8 h-48 sm:h-52 w-full">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={viewMode === 'category' ? categoryData : toolData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(state: any) => {
                    if (viewMode === 'category' && state?.activePayload?.[0]?.payload?.key) {
                      onSelectCategory(state.activePayload[0].payload.key as ProjectCategory);
                    }
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  >
                    {(viewMode === 'category' ? categoryData : toolData).map((entry, index) => {
                      const isSelected = activeCategory === (entry as any).key;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={isSelected ? '#ffffff' : 'none'}
                          strokeWidth={isSelected ? 2 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={viewMode === 'category' ? categoryData : toolData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    className="cursor-pointer focus:outline-none"
                    onClick={(entry: any) => {
                      if (viewMode === 'category' && entry?.key) {
                        onSelectCategory(entry.key as ProjectCategory);
                      }
                    }}
                  >
                    {(viewMode === 'category' ? categoryData : toolData).map((entry, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={entry.fill}
                        stroke="#020617"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Metrics & Interactive Chips */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-3 bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80">
            {/* Metric Counters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ru' ? 'Всего проектов' : language === 'en' ? 'Total Projects' : 'Jami Loyihalar'}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {totalProjects}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block font-medium">
                  {language === 'ru' ? 'Топ Инструмент' : language === 'en' ? 'Top Tool' : 'Yetakchi Vosita'}
                </span>
                <span className="text-sm font-bold font-mono text-cyan-400 truncate block" title={topTool}>
                  {topTool}
                </span>
              </div>
            </div>

            {/* Quick interactive items */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>
                  {viewMode === 'category'
                    ? language === 'ru' ? 'Нажмите для фильтра:' : language === 'en' ? 'Filter by category:' : 'Yo\'nalishni filtrlash:'
                    : language === 'ru' ? 'Популярные технологии:' : language === 'en' ? 'Popular technologies:' : 'Mashhur texnologiyalar:'}
                </span>
                {activeCategory !== 'all' && (
                  <button
                    onClick={() => onSelectCategory('all')}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    {language === 'ru' ? 'Сброс' : language === 'en' ? 'Reset' : 'Barchasi'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {viewMode === 'category' ? (
                  categoryData.map((cat) => {
                    const isSelected = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => onSelectCategory(isSelected ? 'all' : cat.key)}
                        className={`text-[10px] px-2 py-1 rounded-md font-medium transition flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-white text-slate-950 font-bold border-white'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: cat.fill }}
                        />
                        <span>{cat.name}</span>
                        <span className="font-mono text-slate-400">({cat.count})</span>
                      </button>
                    );
                  })
                ) : (
                  toolData.map((t) => (
                    <span
                      key={t.name}
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-900 text-cyan-300 border border-slate-800 flex items-center gap-1"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: t.fill }}
                      />
                      <span>{t.name}</span>
                      <span className="text-slate-400">×{t.count}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
