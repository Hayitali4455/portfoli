import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Contrast, ChevronDown, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, isLight, isMidnight, isSlate } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { id: ThemeMode; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'light',
      label: "Yorug'",
      desc: "Oq va toza kunduzgi ko'rinish",
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: "text-amber-500"
    },
    {
      id: 'slate',
      label: "Yumshoq Tungi",
      desc: "Ko'zga mayin standart qorong'u",
      icon: <Moon className="w-4 h-4 text-cyan-400" />,
      color: "text-cyan-400"
    },
    {
      id: 'midnight',
      label: "O'ta Qora",
      desc: "Chuqur OLED qora rejim",
      icon: <Contrast className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400"
    }
  ];

  const currentOption = options.find((o) => o.id === theme) || options[1];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Mavzuni o'zgartirish (Yorug'roq / Qoraroq)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
          isLight 
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' 
            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200'
        }`}
      >
        <span className="shrink-0">{currentOption.icon}</span>
        <span className="hidden md:inline text-[11px] font-medium">{currentOption.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
          isLight
            ? 'bg-white text-slate-900 shadow-slate-300/50'
            : 'bg-slate-900 text-slate-100 shadow-black/80'
        }`}>
          <div className="px-3 py-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Displey Yorug'ligi / Rejim
            </p>
            <p className="text-[11px] text-slate-400">
              Qoraroq yoki yorug'roq rejimni tanlang
            </p>
          </div>

          <div className="p-1 space-y-1">
            {options.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left ${
                    isSelected
                      ? isLight 
                        ? 'bg-slate-100 font-bold text-slate-900' 
                        : 'bg-slate-800 font-bold text-white'
                      : isLight 
                        ? 'hover:bg-slate-50 text-slate-700' 
                        : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isLight ? 'bg-white shadow-xs' : 'bg-slate-950'}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-xs leading-tight">
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
