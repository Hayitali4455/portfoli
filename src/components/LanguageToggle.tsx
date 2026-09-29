import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface LanguageToggleProps {
  className?: string;
  variant?: 'dropdown' | 'segmented';
}

const LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'uz', name: "O'zbek", nativeName: "O'zbekcha", flag: "🇺🇿" },
  { code: 'ru', name: "Русский", nativeName: "Русский язык", flag: "🇷🇺" },
  { code: 'en', name: "English", nativeName: "English", flag: "🇬🇧" }
];

export default function LanguageToggle({ className = '', variant = 'dropdown' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'segmented') {
    return (
      <div className={`flex items-center p-1 rounded-xl bg-slate-950/80 backdrop-blur-md shadow-inner gap-1 ${className}`}>
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-mono'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 transition shadow-sm hover:text-emerald-400 group"
        title="Tilni o'zgartirish / Сменить язык / Change language"
      >
        <span className="text-sm leading-none">{currentLangObj.flag}</span>
        <span className="font-mono font-bold tracking-wide">{currentLangObj.code.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900/95 backdrop-blur-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Til / Язык / Language
          </div>
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="text-left">
                    <span className="block leading-tight">{lang.name}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{lang.nativeName}</span>
                  </div>
                </div>
                {isActive && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
