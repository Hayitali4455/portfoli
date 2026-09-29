export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  // Navigation & Brand
  brandName: string;
  brandRole: string;
  navProjects: string;
  navMap: string;
  navSkills: string;
  navExperience: string;
  navContact: string;
  share: string;
  resume: string;
  newProject: string;
  login: string;
  profile: string;
  adminPanel: string;
  openInWindow: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroDescription: string;
  heroBtnExplore: string;
  heroBtnMap: string;
  heroBtnAdd: string;
  heroStatMaps: string;
  heroStatMapsSub: string;
  heroStatArea: string;
  heroStatAreaSub: string;
  heroStatExp: string;
  heroStatExpSub: string;
  heroStatCrs: string;
  heroStatCrsSub: string;

  // Projects Section
  projectsBadge: string;
  projectsTitle: string;
  projectsSubtitle: string;
  projectsOpenModal: string;
  projectsAddBtn: string;
  projectsSearchPlaceholder: string;
  projectsToolLabel: string;
  projectsAllTools: string;
  projectsClearFilters: string;
  projectsNotFound: string;
  projectsNotFoundDesc: string;
  
  // Categories
  catAll: string;
  catAgriculture: string;
  catForestry: string;
  catEcology: string;
  catCadastre: string;
  catAiArcgisTools: string;
  cat3dModeling: string;
  catHydrologyEco: string;
  catUrbanCadastre: string;
  catGeodesyTopo: string;
  catAgriNdvi: string;
  catAiTools: string;
  catArcgisTools: string;

  // Project Card
  cardViewDetails: string;
  cardFocusMap: string;
  cardExport: string;
  cardExported: string;
  cardCoordinates: string;
  cardArea: string;
  cardScale: string;

  // Map Section
  mapBadge: string;
  mapTitle: string;
  mapSubtitle: string;

  // Skills Section
  skillsBadge: string;
  skillsTitle: string;
  skillsSubtitle: string;
  skillsOpenModal: string;
  skillsMethodsTitle: string;
  skillsMethod1: string;
  skillsMethod2: string;
  skillsMethod3: string;
  skillsMethod4: string;
  skillsMethod5: string;
  skillsMethod6: string;

  // Experience Section
  expBadge: string;
  expTitle: string;
  expSubtitle: string;
  expOpenModal: string;
  expTimelineTitle: string;
  expCertsTitle: string;
  expEduTitle: string;
  expEduDegree: string;
  expEduMajor: string;
  expEduUniv: string;
  expEduSpec: string;

  // Contact Section
  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;
  contactDirectTitle: string;
  contactEmailLabel: string;
  contactTelegramLabel: string;
  contactLocationLabel: string;
  contactLocationVal: string;
  contactAvailableBadge: string;
  contactFormName: string;
  contactFormEmail: string;
  contactFormSubject: string;
  contactFormSubjectPlh: string;
  contactFormMsg: string;
  contactFormMsgPlh: string;
  contactFormSend: string;
  contactSuccessTitle: string;
  contactSuccessDesc: string;
  contactSendNew: string;

  // Modals & General
  modalClose: string;
  modalFullscreen: string;
  modalWindowMode: string;
  modalSpecialist: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  uz: {
    brandName: "Hayitali G'ulomov",
    brandRole: "GIS & Fazoviy Tahlil Mutaxassisi",
    navProjects: "Loyihalar",
    navMap: "Interaktiv Xarita",
    navSkills: "Ko'nikmalar",
    navExperience: "Tajriba",
    navContact: "Bog'lanish",
    share: "Ulashish",
    resume: "Rezyume",
    newProject: "Yangi Loyiha",
    login: "Kirish",
    profile: "Profil",
    adminPanel: "Admin Panel",
    openInWindow: "Alohida Oynada Ochish",

    heroBadge: "Geofazoviy Tahlillar & Kartografiya Portfoliosi",
    heroTitle1: "Geofazoviy Tahlillar,",
    heroTitleHighlight: "Masofadan Zondlash",
    heroTitle2: "va Zamonaviy GIS",
    heroDescription: "QGIS, ArcGIS Pro, Google Earth Engine hamda Python vositalarida amalga oshirilgan xaritalash, kosmik tasvirlar monitoringi (NDVI/NDWI) va shaharsozlik kadastri loyihalari shaxsiy veb-maydoni.",
    heroBtnExplore: "Loyihalarni Ko'rish",
    heroBtnMap: "Interaktiv Xaritada Ochish",
    heroBtnAdd: "Yangi Ish Joylash",
    heroStatMaps: "Tayyor Xaritalar",
    heroStatMapsSub: "Vektor & Rastor qatlamlar",
    heroStatArea: "Tahlil Maydoni",
    heroStatAreaSub: "Sentinel & Landsat qoplami",
    heroStatExp: "GIS Tajriba",
    heroStatExpSub: "Kartografiya & Fazoviy tahlil",
    heroStatCrs: "Koordinata Tizimlari",
    heroStatCrsSub: "WGS84, Pulkovo 1942, SK42",

    projectsBadge: "Bajarilgan Geofazoviy Ishlar",
    projectsTitle: "GIS & Kartografik Loyihalar",
    projectsSubtitle: "Har bir loyiha koordinata tizimi, qatlamlar tarkibi, metodologiya va interaktiv xarita qatlamlari bilan to'liq jihozlangan.",
    projectsOpenModal: "Alohida Oynada Ochish",
    projectsAddBtn: "+ Yangi GIS Loyihasi",
    projectsSearchPlaceholder: "Qidiruv: QGIS, Sentinel-2, Toshkent, NDVI, Orol, Kadastr...",
    projectsToolLabel: "Vosita:",
    projectsAllTools: "Barcha dasturlar",
    projectsClearFilters: "Filtrlarni tozalash",
    projectsNotFound: "Mos loyihalar topilmadi",
    projectsNotFoundDesc: "Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.",

    catAll: "Barcha Loyihalar",
    catAgriculture: "1. Qishloq xo'jaligi",
    catForestry: "2. O'rmon xo'jaligi",
    catEcology: "3. Ekologiya",
    catCadastre: "4. Kadastr",
    catAiArcgisTools: "5. AI & ArcGIS Pro Tools",
    cat3dModeling: "6. 3D Modellashtirish",
    catHydrologyEco: "Gidrologiya & Ekologiya",
    catUrbanCadastre: "Shaharsozlik & Kadastr",
    catGeodesyTopo: "Geodeziya & Topografiya",
    catAgriNdvi: "Qishloq Xo'jaligi & NDVI",
    catAiTools: "AI & Maxsus Vositalar",
    catArcgisTools: "ArcGIS Pro Vositalari",

    cardViewDetails: "Batafsil Ko'rish",
    cardFocusMap: "Xaritada Ko'rish",
    cardExport: "Eksport",
    cardExported: "Yuklandi!",
    cardCoordinates: "Koordinatalar",
    cardArea: "Maydon",
    cardScale: "Masshtab",

    mapBadge: "Interaktiv Xaritalash Konsoli",
    mapTitle: "Geofazoviy Xarita va Qatlamlar Tahlilchisi",
    mapSubtitle: "Sun'iy yo'ldosh (Esri Imagery), Relyef (OpenTopoMap) va qora GIS xaritalarida ob'ektlarni ko'ring. Shuningdek, istalgan .geojson faylni xaritaga tashlab, darhol tahlil qilishingiz mumkin.",

    skillsBadge: "Ko'nikmalar & Texnologik Vositalar",
    skillsTitle: "Geofazoviy Tahlil va Dasturiy Salohiyat",
    skillsSubtitle: "Geodezik koordinata tizimlaridan tortib, bulutli kosmik monitoring (GEE), fazoviy SQL ma'lumotlar bazasi va interaktiv veb-kartografiyagacha bo'lgan chuqur professional bilimlar.",
    skillsOpenModal: "Ko'nikmalarni Alohida Oynada Ochish",
    skillsMethodsTitle: "Maxsus metodologiyalar va amaliy tajribalar",
    skillsMethod1: "NDVI, NDWI, NDBI spektral indekslari",
    skillsMethod2: "SRTM & ALOS DEM gidrologik modellashtirish",
    skillsMethod3: "AHP ko'p mezonli fazoviy baholash",
    skillsMethod4: "PostGIS pgRouting va tarmoq tahlili",
    skillsMethod5: "Dron fotogrammetriyasi (Ortofotoplan)",
    skillsMethod6: "SK-42 va WGS-84 koordinata konvertatsiyasi",

    expBadge: "Mehnat Faoliyati & Sertifikatlar",
    expTitle: "Professional Tajriba va Malaka",
    expSubtitle: "Geofazoviy loyihalarni rejalashtirishdan to to'liq amalga oshirishgacha bo'lgan amaliy bosqichlar va xalqaro sertifikatlar.",
    expOpenModal: "Tajribani Alohida Oynada Ochish",
    expTimelineTitle: "Ish Tajribasi Xronologiyasi",
    expCertsTitle: "Sertifikatlar & Malaka",
    expEduTitle: "Ta'lim",
    expEduDegree: "Oliy Ma'lumot (Bakalavriat & Magistratura)",
    expEduMajor: "Geodeziya, Kartografiya va Geoinformatika (GIS)",
    expEduUniv: "Milliy Universitet / Toshkent Arxitektura va Qurilish Universiteti",
    expEduSpec: "Ixtisoslik: Geofazoviy axborot tizimlari va masofadan zondlash",

    contactBadge: "Bog'lanish & Hamkorlik",
    contactTitle: "Geofazoviy Loyihalar Bo'yicha Aloqa",
    contactSubtitle: "GIS loyihalari, xaritalash, kosmik monitoring (NDVI) yoki kadastr tahlillari bo'yicha maslahat va hamkorlik uchun xabar qoldiring.",
    contactDirectTitle: "To'g'ridan-To'g'ri Aloqa",
    contactEmailLabel: "Elektron Pochta:",
    contactTelegramLabel: "Telegram:",
    contactLocationLabel: "Joylashuv:",
    contactLocationVal: "Toshkent shahri, O'zbekiston",
    contactAvailableBadge: "Yangi buyurtma va geofazoviy loyihalarga ochiq",
    contactFormName: "Ismingiz",
    contactFormEmail: "Email Manzilingiz",
    contactFormSubject: "Loyiha Yo'nalishi / Mavzu",
    contactFormSubjectPlh: "Masalan: Shaharsozlik xaritasi va NDVI tahlili",
    contactFormMsg: "Xabar Matni",
    contactFormMsgPlh: "Loyiha tavsifi, talablar va taxminiy muddat...",
    contactFormSend: "Xabarni Yuborish",
    contactSuccessTitle: "Xabaringiz Muvaffaqiyatli Qabul Qilindi!",
    contactSuccessDesc: "Rahmat, tez orada siz bilan elektron pochta orqali bog'lanaman.",
    contactSendNew: "Yangi xabar yuborish",

    modalClose: "Yopish",
    modalFullscreen: "To'liq Ekran",
    modalWindowMode: "Keng Oyna",
    modalSpecialist: "Mutaxassis: G'ulomov Hayitali"
  },

  ru: {
    brandName: "Хаитали Гуломов",
    brandRole: "Специалист по ГИС и пространственному анализу",
    navProjects: "Проекты",
    navMap: "Интерактивная карта",
    navSkills: "Навыки",
    navExperience: "Опыт работы",
    navContact: "Контакты",
    share: "Поделиться",
    resume: "Резюме",
    newProject: "Новый проект",
    login: "Войти",
    profile: "Профиль",
    adminPanel: "Панель администратора",
    openInWindow: "Открыть в отдельном окне",

    heroBadge: "Портфолио геопространственного анализа и картографии",
    heroTitle1: "Геопространственный анализ,",
    heroTitleHighlight: "Дистанционное зондирование",
    heroTitle2: "и современные ГИС",
    heroDescription: "Персональное пространство проектов картографии, спутникового мониторинга (NDVI/NDWI) и градостроительного кадастра в QGIS, ArcGIS Pro, Google Earth Engine и Python.",
    heroBtnExplore: "Смотреть проекты",
    heroBtnMap: "Открыть на интерактивной карте",
    heroBtnAdd: "Добавить проект",
    heroStatMaps: "Готовые карты",
    heroStatMapsSub: "Векторные и растровые слои",
    heroStatArea: "Площадь анализа",
    heroStatAreaSub: "Покрытие Sentinel и Landsat",
    heroStatExp: "Опыт в ГИС",
    heroStatExpSub: "Картография и пространственный анализ",
    heroStatCrs: "Системы координат",
    heroStatCrsSub: "WGS84, Пулково 1942, СК42",

    projectsBadge: "Выполненные геопространственные работы",
    projectsTitle: "ГИС и картографические проекты",
    projectsSubtitle: "Каждый проект снабжен системой координат, составом слоев, методологией и интерактивными картографическими слоями.",
    projectsOpenModal: "Открыть в отдельном окне",
    projectsAddBtn: "+ Новый ГИС-проект",
    projectsSearchPlaceholder: "Поиск: QGIS, Sentinel-2, Ташкент, NDVI, Арал, Кадастр...",
    projectsToolLabel: "Инструмент:",
    projectsAllTools: "Все программы",
    projectsClearFilters: "Сбросить фильтры",
    projectsNotFound: "Подходящие проекты не найдены",
    projectsNotFoundDesc: "Попробуйте изменить поисковый запрос или выбрать другую категорию.",

    catAll: "Все проекты",
    catAgriculture: "1. Сельское хозяйство",
    catForestry: "2. Лесное хозяйство",
    catEcology: "3. Экология",
    catCadastre: "4. Кадастр",
    catAiArcgisTools: "5. ИИ и инструменты ArcGIS Pro",
    cat3dModeling: "6. 3D Моделирование",
    catHydrologyEco: "Гидрология и экология",
    catUrbanCadastre: "Градостроительство и кадастр",
    catGeodesyTopo: "Геодезия и топография",
    catAgriNdvi: "Сельское хозяйство и NDVI",
    catAiTools: "ИИ и спец. инструменты",
    catArcgisTools: "Инструменты ArcGIS Pro",

    cardViewDetails: "Подробнее",
    cardFocusMap: "Показать на карте",
    cardExport: "Экспорт",
    cardExported: "Скачано!",
    cardCoordinates: "Координаты",
    cardArea: "Площадь",
    cardScale: "Масштаб",

    mapBadge: "Консоль интерактивного картирования",
    mapTitle: "Анализатор геопространственных карт и слоев",
    mapSubtitle: "Просматривайте объекты на спутниковых снимках (Esri Imagery), рельефе (OpenTopoMap) и темной ГИС-карте. Перетащите любой файл .geojson для мгновенного анализа.",

    skillsBadge: "Навыки и технологический стек",
    skillsTitle: "Геопространственный анализ и программный потенциал",
    skillsSubtitle: "Глубокие профессиональные знания: от геодезических систем координат, облачного мониторинга (GEE) и баз данных PostGIS до веб-картографии.",
    skillsOpenModal: "Открыть навыки в отдельном окне",
    skillsMethodsTitle: "Специальные методологии и практический опыт",
    skillsMethod1: "Спектральные индексы NDVI, NDWI, NDBI",
    skillsMethod2: "Гидрологическое моделирование SRTM & ALOS DEM",
    skillsMethod3: "Многокритериальная пространственная оценка AHP",
    skillsMethod4: "Сетевой анализ и pgRouting в PostGIS",
    skillsMethod5: "Дроновая фотограмметрия (Ортофотоплан)",
    skillsMethod6: "Конвертация систем координат СК-42 и WGS-84",

    expBadge: "Трудовая деятельность и сертификаты",
    expTitle: "Профессиональный опыт и квалификация",
    expSubtitle: "Практические этапы от планирования до полной реализации геопространственных проектов и международные сертификаты.",
    expOpenModal: "Открыть опыт в отдельном окне",
    expTimelineTitle: "Хронология опыта работы",
    expCertsTitle: "Сертификаты и квалификация",
    expEduTitle: "Образование",
    expEduDegree: "Высшее образование (Бакалавриат и Магистратура)",
    expEduMajor: "Геодезия, картография и геоинформатика (ГИС)",
    expEduUniv: "Национальный университет / Ташкентский архитектурно-строительный университет",
    expEduSpec: "Специализация: Геоинформационные системы и дистанционное зондирование",

    contactBadge: "Связь и сотрудничество",
    contactTitle: "Связь по геопространственным проектам",
    contactSubtitle: "Оставьте заявку для консультаций и сотрудничества по ГИС-проектам, картографии, спутниковому мониторингу (NDVI) или кадастру.",
    contactDirectTitle: "Прямой контакт",
    contactEmailLabel: "Электронная почта:",
    contactTelegramLabel: "Telegram:",
    contactLocationLabel: "Местоположение:",
    contactLocationVal: "город Ташкент, Узбекистан",
    contactAvailableBadge: "Открыт для новых заказов и геопространственных проектов",
    contactFormName: "Ваше имя",
    contactFormEmail: "Ваш Email",
    contactFormSubject: "Тема проекта / Направление",
    contactFormSubjectPlh: "Например: Карта градостроительства и анализ NDVI",
    contactFormMsg: "Текст сообщения",
    contactFormMsgPlh: "Описание проекта, требования и ориентировочные сроки...",
    contactFormSend: "Отправить сообщение",
    contactSuccessTitle: "Ваше сообщение успешно принято!",
    contactSuccessDesc: "Спасибо, в скором времени я свяжусь с вами по электронной почте.",
    contactSendNew: "Отправить новое сообщение",

    modalClose: "Закрыть",
    modalFullscreen: "Полный экран",
    modalWindowMode: "Оконный режим",
    modalSpecialist: "Специалист: Хаитали Гуломов"
  },

  en: {
    brandName: "Hayitali Gulomov",
    brandRole: "GIS & Spatial Analysis Specialist",
    navProjects: "Projects",
    navMap: "Interactive Map",
    navSkills: "Skills",
    navExperience: "Experience",
    navContact: "Contact",
    share: "Share",
    resume: "Resume",
    newProject: "New Project",
    login: "Login",
    profile: "Profile",
    adminPanel: "Admin Panel",
    openInWindow: "Open in Window",

    heroBadge: "Geospatial Analysis & Cartography Portfolio",
    heroTitle1: "Geospatial Analysis,",
    heroTitleHighlight: "Remote Sensing",
    heroTitle2: "& Modern GIS",
    heroDescription: "Personal showcase of cartography, Earth observation monitoring (NDVI/NDWI), and urban cadastre projects powered by QGIS, ArcGIS Pro, Google Earth Engine, and Python.",
    heroBtnExplore: "Explore Projects",
    heroBtnMap: "Open Interactive Map",
    heroBtnAdd: "Submit Project",
    heroStatMaps: "Finished Maps",
    heroStatMapsSub: "Vector & Raster layers",
    heroStatArea: "Analysis Area",
    heroStatAreaSub: "Sentinel & Landsat coverage",
    heroStatExp: "GIS Experience",
    heroStatExpSub: "Cartography & Spatial analysis",
    heroStatCrs: "Coordinate Systems",
    heroStatCrsSub: "WGS84, Pulkovo 1942, SK42",

    projectsBadge: "Completed Geospatial Works",
    projectsTitle: "GIS & Cartographic Projects",
    projectsSubtitle: "Every project is thoroughly documented with coordinate systems, layer hierarchies, methodologies, and interactive map layers.",
    projectsOpenModal: "Open in Dedicated Window",
    projectsAddBtn: "+ New GIS Project",
    projectsSearchPlaceholder: "Search: QGIS, Sentinel-2, Tashkent, NDVI, Aral, Cadastre...",
    projectsToolLabel: "Tool:",
    projectsAllTools: "All software tools",
    projectsClearFilters: "Clear filters",
    projectsNotFound: "No matching projects found",
    projectsNotFoundDesc: "Try adjusting your search query or selecting a different category.",

    catAll: "All Projects",
    catAgriculture: "1. Agriculture",
    catForestry: "2. Forestry",
    catEcology: "3. Ecology",
    catCadastre: "4. Cadastre",
    catAiArcgisTools: "5. AI & ArcGIS Pro Tools",
    cat3dModeling: "6. 3D Modeling",
    catHydrologyEco: "Hydrology & Ecology",
    catUrbanCadastre: "Urban & Cadastre",
    catGeodesyTopo: "Geodesy & Topography",
    catAgriNdvi: "Agriculture & NDVI",
    catAiTools: "AI & Special Tools",
    catArcgisTools: "ArcGIS Pro Tools",

    cardViewDetails: "View Details",
    cardFocusMap: "Focus on Map",
    cardExport: "Export",
    cardExported: "Exported!",
    cardCoordinates: "Coordinates",
    cardArea: "Area",
    cardScale: "Scale",

    mapBadge: "Interactive Mapping Console",
    mapTitle: "Geospatial Map & Layers Analyzer",
    mapSubtitle: "View objects across satellite imagery (Esri Imagery), topography (OpenTopoMap), and dark GIS basemaps. Drop any .geojson file for instant spatial analysis.",

    skillsBadge: "Skills & Technological Stack",
    skillsTitle: "Geospatial Analysis & Software Proficiency",
    skillsSubtitle: "Deep professional expertise spanning geodetic coordinate systems, cloud Earth observation (GEE), PostGIS spatial databases, and interactive web mapping.",
    skillsOpenModal: "Open Skills in Dedicated Window",
    skillsMethodsTitle: "Specialized Methodologies & Practical Experience",
    skillsMethod1: "NDVI, NDWI, NDBI spectral index calculation",
    skillsMethod2: "SRTM & ALOS DEM hydrological watershed modeling",
    skillsMethod3: "AHP multi-criteria spatial decision analysis",
    skillsMethod4: "PostGIS pgRouting and topological network analysis",
    skillsMethod5: "Drone photogrammetry (Orthophotomosaic generation)",
    skillsMethod6: "SK-42 and WGS-84 coordinate transformation",

    expBadge: "Work Experience & Credentials",
    expTitle: "Professional Experience & Credentials",
    expSubtitle: "Practical progression from geospatial project planning to full deployment, supported by international certifications.",
    expOpenModal: "Open Experience in Dedicated Window",
    expTimelineTitle: "Work Experience Timeline",
    expCertsTitle: "Certifications & Credentials",
    expEduTitle: "Education",
    expEduDegree: "Higher Education (BSc & MSc)",
    expEduMajor: "Geodesy, Cartography & Geoinformatics (GIS)",
    expEduUniv: "National University / Tashkent Architecture and Civil Engineering University",
    expEduSpec: "Specialization: Geospatial Information Systems & Earth Observation",

    contactBadge: "Contact & Collaboration",
    contactTitle: "Get in Touch for Geospatial Projects",
    contactSubtitle: "Send a message for consultation and collaboration regarding GIS projects, cartography, satellite monitoring (NDVI), or cadastral analysis.",
    contactDirectTitle: "Direct Contact",
    contactEmailLabel: "Email Address:",
    contactTelegramLabel: "Telegram:",
    contactLocationLabel: "Location:",
    contactLocationVal: "Tashkent City, Uzbekistan",
    contactAvailableBadge: "Available for new inquiries & geospatial projects",
    contactFormName: "Your Name",
    contactFormEmail: "Your Email Address",
    contactFormSubject: "Project Direction / Subject",
    contactFormSubjectPlh: "e.g., Urban planning map & NDVI analysis",
    contactFormMsg: "Message Text",
    contactFormMsgPlh: "Project description, requirements, and target timeframe...",
    contactFormSend: "Send Message",
    contactSuccessTitle: "Your Message Has Been Received!",
    contactSuccessDesc: "Thank you! I will get back to you shortly via email.",
    contactSendNew: "Send another message",

    modalClose: "Close",
    modalFullscreen: "Fullscreen",
    modalWindowMode: "Window Mode",
    modalSpecialist: "Specialist: Hayitali Gulomov"
  }
};
