import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, MessageSquare, Phone, Globe, Compass } from 'lucide-react';
import { ContactFormData } from '../types';
import contactBgImage from '../assets/images/contact_gis_bg_1790162241165.jpg';
import Footer, { FooterProps } from './Footer';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './EditableText';

interface ContactSectionProps extends Partial<FooterProps> {}

export default function ContactSection({
  onExportData,
  onImportData,
  onResetDefaults,
  onOpenShareModal,
  onScrollToSection,
  onOpenLogoModal,
  onExportAllCSV
}: ContactSectionProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <section 
      id="contact-section" 
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-950 w-full"
    >
      {/* Background Graphic Asset from River Delta & Satellite cartography */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 pointer-events-none scale-[1.02] transform transition-transform duration-1000"
        style={{ backgroundImage: `url(${contactBgImage})` }}
      />
      {/* High-tech Vignette & Gradients to guarantee high contrast and crisp typography */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />
      {/* Seamless blending gradients between sections */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />

      {/* Screen-spanning Wide Container */}
      <div className="relative z-10 w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wider uppercase mb-4 drop-shadow">
            <Mail className="w-4 h-4 sm:w-5 h-5" />
            <span>{t('contactBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
            <EditableText
              contentKey="contact_section_title"
              defaultValue={t('contactTitle') || "Bog'lanish va Hamkorlik"}
              label="Aloqa sarlavhasi"
            />
          </h2>
          <div className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed drop-shadow max-w-4xl mx-auto">
            <EditableText
              contentKey="contact_section_desc"
              defaultValue={t('contactSubtitle') || "GIS loyihalari, masofadan zondlash tahlili yoki shaharsozlik kadastri bo'yicha takliflaringiz bo'lsa xabar yuboring."}
              label="Aloqa tavsifi"
              multiline={true}
            />
          </div>
        </div>

        {/* Wide Full-Width Grid (5 cols Left / 7 cols Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 w-full">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-7 sm:p-9 shadow-2xl space-y-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3 mb-8">
                  <Compass className="w-5 h-5 sm:w-6 h-6 text-emerald-400" /> {t('contactDirectTitle')}
                </h3>

                <div className="space-y-7 text-sm sm:text-base">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-slate-400 text-xs sm:text-sm font-mono mb-1">{t('contactEmailLabel')}</span>
                      <a
                        href="mailto:gulomovhayitali4455@gmail.com"
                        className="font-bold text-white hover:text-emerald-400 transition break-all text-base sm:text-lg leading-snug"
                      >
                        gulomovhayitali4455@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-slate-400 text-xs sm:text-sm font-mono mb-1">{t('contactTelegramLabel')}</span>
                      <a
                        href="https://t.me/Hayitali4455"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-white hover:text-cyan-400 transition text-base sm:text-lg"
                      >
                        @Hayitali4455
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-slate-400 text-xs sm:text-sm font-mono mb-1">{t('contactLocationLabel')}</span>
                      <span className="font-semibold text-slate-200 text-base sm:text-lg">
                        {t('contactLocationVal')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-6">
                <div className="p-5 rounded-2xl bg-emerald-950/60 shadow-xl flex items-center gap-3.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-300">
                    {t('contactAvailableBadge')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-7 sm:p-10 shadow-2xl h-full flex flex-col justify-center">
              {isSubmitted ? (
                <div className="py-12 sm:py-16 text-center space-y-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {t('contactSuccessTitle')}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                    {t('contactSuccessDesc')}
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-6 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition shadow-lg"
                  >
                    {t('contactSendNew')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-mono text-slate-300 mb-2 font-semibold">
                        {t('contactFormName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('contactFormName')}
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-mono text-slate-300 mb-2 font-semibold">
                        {t('contactFormEmail')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@domain.com"
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-slate-300 mb-2 font-semibold">
                      {t('contactFormSubject')}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t('contactFormSubjectPlh')}
                      className="w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono text-slate-300 mb-2 font-semibold">
                      {t('contactFormMsg')} *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('contactFormMsgPlh')}
                      className="w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base resize-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base transition shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 hover:scale-[1.01]"
                  >
                    <Send className="w-5 h-5 stroke-[2.5]" />
                    <span>{t('contactFormSend')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Footer Navigation & Administrative Utilities */}
        <div className="mt-20">
          <Footer
            onExportData={onExportData || (() => {})}
            onImportData={onImportData || (() => {})}
            onResetDefaults={onResetDefaults || (() => {})}
            onOpenShareModal={onOpenShareModal || (() => {})}
            onScrollToSection={onScrollToSection || (() => {})}
            onOpenLogoModal={onOpenLogoModal}
            onExportAllCSV={onExportAllCSV}
          />
        </div>
      </div>
    </section>
  );
}
