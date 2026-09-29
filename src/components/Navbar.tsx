import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  FileText, 
  Menu, 
  X, 
  Globe, 
  Map, 
  Share2, 
  User, 
  CheckCircle2, 
  LogIn,
  Layers,
  Cpu,
  Briefcase,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDownloadPermissions } from '../context/DownloadPermissionsContext';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import EditableText from './EditableText';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenResumeModal: () => void;
  onOpenShareModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenProfileModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenProjectsModal: () => void;
  onOpenMapModal: () => void;
  onOpenSkillsModal: () => void;
  onOpenExperienceModal: () => void;
  onOpenAdminRequestsModal?: () => void;
  onOpenLogoModal?: () => void;
}

export default function Navbar({
  onOpenAddModal,
  onOpenResumeModal,
  onOpenShareModal,
  onOpenAuthModal,
  onOpenProfileModal,
  onScrollToSection,
  onOpenProjectsModal,
  onOpenMapModal,
  onOpenSkillsModal,
  onOpenExperienceModal,
  onOpenAdminRequestsModal,
  onOpenLogoModal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userProfile, isAdmin, isSiteEditor } = useAuth();
  const { pendingRequestsCount } = useDownloadPermissions();
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || (language === 'ru' ? "Пользователь" : language === 'en' ? "User" : "Foydalanuvchi");
  const isVerified = userProfile?.isEmailVerified || user?.emailVerified;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const navLinks = [
    { 
      label: t('navProjects'), 
      id: 'projects-section', 
      isModal: true, 
      action: onOpenProjectsModal,
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />
    },
    { 
      label: t('navMap'), 
      id: 'map-section', 
      isModal: true, 
      action: onOpenMapModal,
      icon: <Map className="w-3.5 h-3.5 text-cyan-400" />
    },
    { 
      label: t('navSkills'), 
      id: 'skills-section', 
      isModal: true, 
      action: onOpenSkillsModal,
      icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" />
    },
    { 
      label: t('navExperience'), 
      id: 'experience-section', 
      isModal: true, 
      action: onOpenExperienceModal,
      icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" />
    },
    { 
      label: t('navContact'), 
      id: 'contact-section', 
      isModal: false, 
      action: () => onScrollToSection('contact-section') 
    }
  ];

  const handleLinkClick = (item: typeof navLinks[0]) => {
    if (item.isModal && item.action) {
      item.action();
    } else {
      onScrollToSection(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/90 backdrop-blur-md shadow-xl' 
        : 'unified-gis-header-transparent bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Name */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div 
            onClick={(e) => {
              if (onOpenLogoModal) {
                e.stopPropagation();
                onOpenLogoModal();
              }
            }}
            className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer"
            title="Logotipni katta ekranda ko'rish uchun bosing"
          >
            <img 
              src="/assets/gis_logo_3d.png" 
              alt="Hayitali G'ulomov 3D GIS Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.7)] group-hover:drop-shadow-[0_0_22px_rgba(16,185,129,0.95)] group-hover:rotate-6 transition-all duration-300 select-none"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-extrabold text-white text-base tracking-tight whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <EditableText
                  contentKey="brand_name"
                  defaultValue={t('brandName') || "HAYITALI G'ULOMOV"}
                  label="Brend nomi"
                />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-medium tracking-wide whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <EditableText
                contentKey="brand_role"
                defaultValue={t('brandRole') || "GIS Mutaxassisi & Kartograf"}
                label="Kasbiy unvon"
              />
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-emerald-400 hover:bg-slate-900/60 transition group"
              title={link.isModal ? `${link.label} (${t('openInWindow')})` : link.label}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.isModal && (
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Language Selector (UZ / RU / EN) */}
          <LanguageToggle />

          {/* Theme Selector (Yorug'roq / Qoraroq) */}
          <ThemeToggle />

          {/* GIS AI Chat Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-gis-chat'))}
            title={language === 'ru' ? 'ГИС ИИ Консультант (Gemini 3)' : language === 'en' ? 'GIS AI Assistant (Gemini 3)' : 'GIS AI Maslahatchi (Gemini 3)'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/30 transition shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">GIS AI Chat</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            title={t('share')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-emerald-400 bg-slate-900/90 hover:bg-slate-800 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">{t('share')}</span>
          </button>

          {/* Resume Button */}
          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('resume')}</span>
          </button>

          {/* Add Project Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{t('newProject')}</span>
          </button>

          {/* Admin Download Requests Button */}
          {isAdmin && onOpenAdminRequestsModal && (
            <button
              onClick={onOpenAdminRequestsModal}
              title="Dasturlarni yuklab olish so'rovlarini boshqarish"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/70 hover:bg-purple-900/80 transition shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Ruxsatlar</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <button
              onClick={onOpenProfileModal}
              title="Profilingizni ko'rish"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-200 transition ml-1 shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-mono font-extrabold flex items-center justify-center text-[10px]">
                {initials}
              </div>
              <span className="font-semibold text-white max-w-[110px] truncate">{displayName}</span>
              {isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Kirish</span>
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Akkaunt Ochish</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition shadow-sm"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="flex items-center justify-between text-left py-2.5 px-3 rounded-xl hover:bg-slate-900 hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.isModal && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    Alohida Oyna
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-3 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  onOpenProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
                    {initials}
                  </div>
                  <span>{displayName}</span>
                </div>
                {isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Kirish</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-sm"
                >
                  <User className="w-4 h-4 stroke-[3]" />
                  <span>Akkaunt Ochish</span>
                </button>
              </div>
            )}

            {/* Admin Requests button in mobile menu */}
            {isAdmin && onOpenAdminRequestsModal && (
              <button
                onClick={() => {
                  onOpenAdminRequestsModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Dasturlar Ruxsatlarini Boshqarish</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {pendingRequestsCount} ta kutilmoqda
                  </span>
                )}
              </button>
            )}

            {/* Mobile Language Selector */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 space-y-2 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 font-semibold px-1">
                Til / Язык / Language:
              </div>
              <LanguageToggle variant="segmented" />
            </div>

            {/* Mobile Theme Selector (Yorug'roq / Qoraroq) */}
            <div className="bg-slate-900/90 rounded-xl p-2 space-y-1.5 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 font-semibold px-1">
                {language === 'ru' ? 'Тема оформления:' : language === 'en' ? 'Display Theme:' : 'Displey Rejimi (Mavzu):'}
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                    theme === 'light'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>☀️ {language === 'ru' ? 'Светлая' : language === 'en' ? 'Light' : "Yorug'"}</span>
                </button>
                <button
                  onClick={() => setTheme('slate')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                    theme === 'slate'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🌙 {language === 'ru' ? 'Ночная' : language === 'en' ? 'Dark' : "Tungi"}</span>
                </button>
                <button
                  onClick={() => setTheme('midnight')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                    theme === 'midnight'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🌑 {language === 'ru' ? 'Глубокая' : language === 'en' ? 'Midnight' : "O'ta Qora"}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-gis-chat'));
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 shadow-sm"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>GIS AI Chatbot (Gemini 3)</span>
            </button>
            <button
              onClick={() => {
                onOpenShareModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-slate-900 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{t('share')}</span>
            </button>
            <button
              onClick={() => {
                onOpenResumeModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 shadow-sm"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{t('resume')} (CV)</span>
            </button>
            <button
              onClick={() => {
                onOpenAddModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('newProject')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

