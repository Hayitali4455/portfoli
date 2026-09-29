import React, { useState } from 'react';
import { X, Search, Check, RotateCcw, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface AdminContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditableItemConfig {
  key: string;
  category: 'hero' | 'stats' | 'sections' | 'contact' | 'footer';
  label: string;
  defaultVal: string;
  multiline?: boolean;
}

const DEFAULT_EDITABLE_ITEMS: EditableItemConfig[] = [
  // Hero
  { key: 'hero_badge', category: 'hero', label: "Bosh sahifa ko'krak nishoni (Badge)", defaultVal: "GEOFARMATIKA VA GEOFATOVIY TAHLIL PORTFOLIYASI" },
  { key: 'hero_title_1', category: 'hero', label: "Bosh sarlavha 1-qism", defaultVal: "Geofazoviy Axborot Tizimlari va" },
  { key: 'hero_title_highlight', category: 'hero', label: "Bosh sarlavha rangli ajratilgan qism", defaultVal: "Masofadan Zondlash" },
  { key: 'hero_title_2', category: 'hero', label: "Bosh sarlavha 2-qism", defaultVal: "Bo'yicha Professional Loyihalar" },
  { key: 'hero_description', category: 'hero', label: "Bosh sahifa tavsif matni", defaultVal: "Sentinel-2, Landsat, Dron fotogrammetriyasi, ArcGIS Pro, QGIS, GEE va sun'iy intellekt (AI) modellariga asoslangan geofazoviy tahlillar, raqamli xaritalar hamda mualliflik dasturlari.", multiline: true },
  { key: 'hero_btn_explore', category: 'hero', label: "Loyihalarni ko'rish tugmasi matni", defaultVal: "Loyihalarni Ko'rish" },
  { key: 'hero_btn_map', category: 'hero', label: "Interaktiv xarita tugmasi matni", defaultVal: "Interaktiv Xarita" },
  { key: 'hero_btn_add', category: 'hero', label: "Dastur/Xarita joylash tugmasi", defaultVal: "Dastur / Xarita Joylash" },

  // Stats
  { key: 'stat_maps_label', category: 'stats', label: "1-statistika sarlavhasi", defaultVal: "XARITALAR & LOYIHALAR" },
  { key: 'stat_maps_sub', category: 'stats', label: "1-statistika pastki izohi", defaultVal: "Saytga yuklangan tayyor xaritalar" },
  { key: 'stat_area_label', category: 'stats', label: "2-statistika sarlavhasi (Maydon)", defaultVal: "TAHLIL QILINGAN MAYDON" },
  { key: 'stat_area_sub', category: 'stats', label: "2-statistika pastki izohi", defaultVal: "Yuklangan xaritalar bo'yicha jami maydon" },
  { key: 'stat_exp_label', category: 'stats', label: "3-statistika sarlavhasi (Tajriba)", defaultVal: "GIS TAJRIBA" },
  { key: 'stat_exp_sub', category: 'stats', label: "3-statistika pastki izohi", defaultVal: "2023-yil 24-iyundan boshlab" },
  { key: 'stat_crs_label', category: 'stats', label: "4-statistika sarlavhasi", defaultVal: "KOORDINATA TIZIMLARI" },
  { key: 'stat_crs_sub', category: 'stats', label: "4-statistika pastki izohi", defaultVal: "WGS-84 / UTM & Pulkovo 1942" },

  // Sections
  { key: 'projects_section_title', category: 'sections', label: "Loyihalar bo'limi sarlavhasi", defaultVal: "GIS & Kartografik Loyihalar" },
  { key: 'projects_section_desc', category: 'sections', label: "Loyihalar bo'limi tavsifi", defaultVal: "Har bir loyiha koordinata tizimi, qatlamlar tarkibi, metodologiya va interaktiv xarita qatlamlari bilan to'liq jihozlangan.", multiline: true },
  { key: 'skills_section_title', category: 'sections', label: "Ko'nikmalar bo'limi sarlavhasi", defaultVal: "Geofazoviy Ko'nikmalar & Texnologiyalar" },
  { key: 'skills_section_desc', category: 'sections', label: "Ko'nikmalar tavsifi", defaultVal: "Desktop GIS, Masofadan zondlash, fazoviy ma'lumotlar bazalari va AI neyron tarmoqlaridan foydalanish bo'yicha amaliy tajribalar.", multiline: true },
  { key: 'experience_section_title', category: 'sections', label: "Ish tajribasi bo'limi sarlavhasi", defaultVal: "Professional Tajriba & Faoliyat" },
  { key: 'experience_section_desc', category: 'sections', label: "Ish tajribasi tavsifi", defaultVal: "2023-yil 24-iyundan boshlab geofazoviy texnologiyalar va masofadan zondlash sohasidagi amaliy yutuqlar.", multiline: true },

  // Contact
  { key: 'contact_section_title', category: 'contact', label: "Aloqa bo'limi sarlavhasi", defaultVal: "Bog'lanish va Hamkorlik" },
  { key: 'contact_section_desc', category: 'contact', label: "Aloqa bo'limi tavsifi", defaultVal: "GIS loyihalari, masofadan zondlash tahlili yoki shaharsozlik kadastri bo'yicha takliflaringiz bo'lsa xabar yuboring.", multiline: true },
  { key: 'contact_email', category: 'contact', label: "Aloqa elektron pochtasi", defaultVal: "gulomovhayitali4455@gmail.com" },
  { key: 'contact_phone', category: 'contact', label: "Aloqa telefon raqami", defaultVal: "+998 90 123 45 67" },
  { key: 'contact_telegram', category: 'contact', label: "Telegram profil", defaultVal: "@Hayitali_GIS" },
  { key: 'contact_location', category: 'contact', label: "Manzil / Joylashuv", defaultVal: "Toshkent shahri, O'zbekiston" },

  // Footer
  { key: 'footer_rights', category: 'footer', label: "Footer mualliflik huquqi", defaultVal: "© 2024-2026 Hayitali G'ulomov. Barcha huquqlar himoyalangan." }
];

export default function AdminContentManagerModal({ isOpen, onClose }: AdminContentManagerModalProps) {
  const { texts, getText, updateText, resetText, isSaving } = useSiteContent();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = DEFAULT_EDITABLE_ITEMS.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const currentVal = getText(item.key, item.defaultVal).toLowerCase();
      return item.label.toLowerCase().includes(q) || item.key.toLowerCase().includes(q) || currentVal.includes(q);
    }
    return true;
  });

  const handleStartEdit = (item: EditableItemConfig) => {
    setEditingKey(item.key);
    setTempValue(getText(item.key, item.defaultVal));
  };

  const handleSave = async (key: string) => {
    await updateText(key, tempValue);
    setEditingKey(null);
    setSaveSuccessMsg(`"${key}" yangilandi va barcha foydalanuvchilar uchun saqlandi!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleReset = async (key: string) => {
    if (window.confirm("Ushbu yozuvni standart dastlabki holatiga qaytarishni xohlaysizmi?")) {
      await resetText(key);
      setEditingKey(null);
      setSaveSuccessMsg(`"${key}" dastlabki holatga qaytarildi!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Sayt Yozuvlari va Matnlari Boshqaruvi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                  Jonli sinxronizatsiya
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Istalgan matnni o'zgartiring — o'zgarishlar barcha akkauntlar va tashrif buyuruvchilarga avtomatik ko'rinadi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {saveSuccessMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Filters and search */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Yozuvlarni qidirish..."
              className="w-full bg-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-white border border-slate-700 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'hero', label: 'Bosh sahifa (Hero)' },
              { id: 'stats', label: 'Statistika' },
              { id: 'sections', label: "Bo'limlar" },
              { id: 'contact', label: 'Aloqa' },
              { id: 'footer', label: 'Footer' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
          {filteredItems.map((item) => {
            const isItemEditing = editingKey === item.key;
            const currentVal = getText(item.key, item.defaultVal);
            const isCustomized = texts[item.key] !== undefined && texts[item.key] !== '';

            return (
              <div
                key={item.key}
                className={`p-3.5 sm:p-4 rounded-xl border transition ${
                  isItemEditing
                    ? 'bg-slate-950 border-emerald-500 shadow-xl'
                    : isCustomized
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      {isCustomized && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          O'zgartirilgan
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.key}</span>
                  </div>

                  {!isItemEditing && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCustomized && (
                        <button
                          type="button"
                          onClick={() => handleReset(item.key)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition text-xs"
                          title="Standart holatga qaytarish"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition"
                      >
                        O'zgartirish
                      </button>
                    </div>
                  )}
                </div>

                {isItemEditing ? (
                  <div className="space-y-3 pt-1">
                    {item.multiline ? (
                      <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 text-white rounded-lg p-2.5 text-xs font-sans border border-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      />
                    ) : (
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-sans border border-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      />
                    )}

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingKey(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(item.key)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Saqlash (Barcha uchun)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 break-words">
                    {currentVal}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Jami {filteredItems.length} ta yozuv</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
