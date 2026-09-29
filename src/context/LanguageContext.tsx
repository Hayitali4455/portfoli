import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, TRANSLATIONS } from '../i18n/translations';
import { GISProject } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  translations: Translations;
  getLocalizedProject: (project: GISProject) => GISProject;
  getLocalizedSkillCategory: (cat: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('gis_portfolio_lang') as Language;
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('gis_portfolio_lang', lang);
    } catch {
      // ignore
    }
  };

  const translations = TRANSLATIONS[language] || TRANSLATIONS.uz;

  const t = (key: keyof Translations): string => {
    return translations[key] || TRANSLATIONS.uz[key] || (key as string);
  };

  const getLocalizedSkillCategory = (cat: string): string => {
    if (language === 'uz') return cat;

    if (language === 'ru') {
      if (cat.includes('Desktop')) return "Настольные и профессиональные ГИС (Desktop GIS)";
      if (cat.includes('Masofadan') || cat.includes('Remote')) return "Дистанционное зондирование и спутники (Remote Sensing)";
      if (cat.includes('Geodasturlash') || cat.includes('Python')) return "Геопрограммирование и пространственные БД (PostGIS / Python)";
      if (cat.includes('Standartlar') || cat.includes('Kartografiya')) return "Стандарты, картография и геодезия (GNSS / Geodesy)";
      return cat;
    }

    if (language === 'en') {
      if (cat.includes('Desktop')) return "Desktop & Professional GIS";
      if (cat.includes('Masofadan') || cat.includes('Remote')) return "Remote Sensing & Satellite Earth Observation";
      if (cat.includes('Geodasturlash') || cat.includes('Python')) return "Geoprogramming & Spatial Databases (PostGIS / Python)";
      if (cat.includes('Standartlar') || cat.includes('Kartografiya')) return "Standards, Cartography & Geodesy (GNSS / Geodesy)";
      return cat;
    }

    return cat;
  };

  // Localized project details for the 6 canonical projects
  const getLocalizedProject = (project: GISProject): GISProject => {
    if (language === 'uz') return project;

    // 1. Qishloq xo'jaligi (Agriculture)
    if (project.id === 'proj-agriculture') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Дистанционный мониторинг сельскохозяйственных угодий и состояния культур (NDVI и водный стресс)",
          shortDescription: "Геопространственный мониторинг динамики вегетации (NDVI, NDRE), влажности почвы и потребности в орошении с помощью снимков Sentinel-2 и Planet.",
          locationName: "Сырдарьинская и Джизакская области, Мирзачульский агромассив",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "Remote Sensing Monitoring of Agricultural Lands and Crop Health (NDVI & Water Stress)",
          shortDescription: "Geospatial tracking of vegetation dynamics (NDVI, NDRE), soil moisture, and irrigation needs using Sentinel-2 and Planet multispectral imagery.",
          locationName: "Sirdaryo and Jizzakh Regions, Mirzachul Agricultural Basin",
        };
      }
    }

    // 2. O'rmon xo'jaligi (Forestry)
    if (project.id === 'proj-forestry') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Картирование лесного фонда, плотности полога леса и система экологического мониторинга",
          shortDescription: "Пространственное моделирование горно-лесных массивов, границ лесных хозяйств, плотности полога (Canopy Cover) и пожарной опасности.",
          locationName: "Ташкентская область, Чаткальский биосферный заповедник и Бостанлыкский лесной фонд",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "State Forestry Land Mapping, Canopy Density Analysis, and Environmental Monitoring System",
          shortDescription: "Spatial modeling of mountain forest zones, forestry administrative boundaries, canopy cover density, and wildfire hazard prediction.",
          locationName: "Tashkent Region, Chatkal Biosphere Reserve & Bostanliq Forestry",
        };
      }
    }

    // 3. Ekologiya (Ecology)
    if (project.id === 'proj-ecology') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Экологический мониторинг: процессы опустынивания Аралкума, водные бассейны и засоление почв",
          shortDescription: "Многолетний анализ высохшего дна Аральского моря, переноса солепылевых бурь и деградации экосистемы с помощью Landsat и Sentinel-2.",
          locationName: "Республика Каракалпакстан, зона Аральского моря и Приаралья",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "Ecological Monitoring: Aralkum Desertification Dynamics, Water Bodies, and Soil Salinity Analysis",
          shortDescription: "Long-term multitemporal analysis of the dried Aral seabed, salt dust storm dispersion corridors, and ecosystem degradation via Landsat & Sentinel-2.",
          locationName: "Republic of Karakalpakstan, Aral Sea & Muynak Ecological Basin",
        };
      }
    }

    // 4. Kadastr (Cadastre)
    if (project.id === 'proj-cadastre') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Градостроительный кадастр и недвижимость: границы земельных участков и геопространственная инвентаризация",
          shortDescription: "Определение границ земельных участков, топопланы и создание корпоративной базы геоданных (PostGIS/GDB) на основе дроновой ортофотосъемки 5 см.",
          locationName: "г. Ташкент и градостроительные массивы Нового Ташкента",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "Urban & Real Estate Cadastre: Land Parcel Boundaries and Geospatial Building Inventory",
          shortDescription: "High-precision parcel delineation, topographic plans, and Enterprise Geodatabase/PostGIS deployment utilizing 5cm UAV orthophotos and GNSS.",
          locationName: "Tashkent City & New Tashkent Urban Development Parcels",
        };
      }
    }

    // 5. AI orqali model va ArcGIS Pro uchun tools yasash (AI & ArcGIS Pro Tools)
    if (project.id === 'proj-ai-arcgis-tools') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Геопространственная модель ИИ (YOLOv8-Seg) и автоматизированный Python Toolbox (.pyt) для ArcGIS Pro",
          shortDescription: "Модель глубокого обучения для сегментации контуров зданий и дорог с точностью 94.8% и специальный инструмент ArcPy для ArcGIS Pro.",
          locationName: "Республика Узбекистан — универсальный ГИС/ИИ инструмент",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "AI Geospatial Segmentation Model (YOLOv8-Seg) and Automated ArcGIS Pro Python Toolbox (.pyt)",
          shortDescription: "Deep learning model extracting building footprints and road networks at 94.8% accuracy combined with a custom ArcPy geoprocessing toolbox for ArcGIS Pro.",
          locationName: "Republic of Uzbekistan — Universal AI & GIS Tool",
        };
      }
    }

    // 6. 3D Modellashtirish (3D Modeling)
    if (project.id === 'proj-3d-modeling') {
      if (language === 'ru') {
        return {
          ...project,
          title: "Цифровая модель рельефа (DEM/DSM) и 3D-фотограмметрическое моделирование историко-городских территорий",
          shortDescription: "Создание цифрового двойника территории (Digital Twin), моделей зданий LOD2/LOD3 и высотных уклонов на основе снимков БПЛА и данных LiDAR.",
          locationName: "Самарканд (Регистан) и 3D-массив г. Ташкента",
        };
      }
      if (language === 'en') {
        return {
          ...project,
          title: "Digital Elevation Models (DEM/DSM) & 3D Photogrammetric Reconstruction of Urban & Historic Areas",
          shortDescription: "Creating high-resolution Digital Twins, LOD2/LOD3 building meshes, and surface elevation slopes from UAV oblique imagery and LiDAR point clouds.",
          locationName: "Samarkand (Registan) and Tashkent 3D Urban Corridors",
        };
      }
    }

    return project;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations,
        getLocalizedProject,
        getLocalizedSkillCategory
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
