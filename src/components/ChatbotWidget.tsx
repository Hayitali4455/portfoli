import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  Cpu, 
  Layers, 
  Satellite, 
  Building2, 
  Code2, 
  Copy, 
  Check, 
  CornerDownLeft,
  ChevronDown,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export type ChatRole = 'general' | 'geoai' | 'remotesensing' | 'cadastre';
export type ChatModel = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export default function ChatbotWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRole>('general');
  const [selectedModel, setSelectedModel] = useState<ChatModel>('gemini-3.5-flash');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial welcome message
  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: language === 'ru' 
        ? "Здравствуйте! Я персональный ГИС-ассистент Хайтали Гуломова. Чем я могу помочь вам по 6 ключевым проектам (сельское хозяйство, лесное хозяйство, экология, кадастр, GeoAI/ArcGIS Pro и 3D) или пространственному анализу?"
        : language === 'en'
        ? "Hello! I am Hayitali G'ulomov's personal GIS & Geospatial AI Assistant. How can I assist you with his 6 flagship projects (Agriculture, Forestry, Ecology, Cadastre, GeoAI/ArcGIS Pro, and 3D Modeling) or geospatial analysis?"
        : "Assalomu alaykum! Men Hayitali G'ulomovning shaxsiy GIS va Geofazoviy AI maslahatchisiman. Hayitalining 6 ta asosiy loyihasi (Qishloq xo'jaligi, O'rmon xo'jaligi, Ekologiya, Kadastr, GeoAI/ArcGIS Pro va 3D) yoki geofazoviy tahlil metodologiyalari bo'yicha qanday yordam bera olaman?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('hayitali_gis_chat_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialMessages;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Support external trigger (e.g. from Navbar)
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-gis-chat', handleOpenChat);
    return () => window.removeEventListener('open-gis-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('hayitali_gis_chat_history_v1', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Suggestion chips
  const suggestions = language === 'ru' ? [
    "Расскажи про 6 проектов Хайтали",
    "Как рассчитывается индекс NDVI в сельском хозяйстве?",
    "Создание Python Toolbox (.pyt) для ArcGIS Pro",
    "Кадастр и обработка данных с дронов"
  ] : language === 'en' ? [
    "Tell me about Hayitali's 6 projects",
    "How is NDVI calculated for agriculture?",
    "Building Python Toolboxes (.pyt) for ArcGIS Pro",
    "Cadastre inventory and UAV drone photogrammetry"
  ] : [
    "Hayitalining 6 ta asosiy loyihasi haqida aytib ber",
    "Qishloq xo'jaligida NDVI indeksi qanday hisoblanadi?",
    "ArcGIS Pro uchun Python Toolbox (.pyt) yaratish",
    "Kadastr va dron fotogrammetriyasi qanday ishlaydi?"
  ];

  const roleOptions: { id: ChatRole; label: string; icon: any; desc: string }[] = [
    {
      id: 'general',
      label: language === 'ru' ? 'ГИС Консультант' : language === 'en' ? 'GIS Consultant' : 'GIS Maslahatchi',
      icon: Layers,
      desc: language === 'ru' ? 'Общие вопросы по проектам и портфолио' : language === 'en' ? 'General portfolio & project queries' : 'Portfel va loyihalar bo\'yicha umumiy maslahat'
    },
    {
      id: 'geoai',
      label: language === 'ru' ? 'GeoAI & ArcPy' : language === 'en' ? 'GeoAI & ArcPy' : 'GeoAI & ArcPy',
      icon: Code2,
      desc: language === 'ru' ? 'Python, ArcPy, YOLOv8 и автоматизация' : language === 'en' ? 'Python, ArcPy, YOLOv8 & automation' : 'Python, ArcPy skriptlar va GeoAI modellar'
    },
    {
      id: 'remotesensing',
      label: language === 'ru' ? 'ДЗЗ и Спутники' : language === 'en' ? 'Remote Sensing' : 'Masofadan Zondlash',
      icon: Satellite,
      desc: language === 'ru' ? 'Sentinel, Landsat, NDVI и спектральные индексы' : language === 'en' ? 'Sentinel, Landsat, NDVI & spectral indices' : 'Sentinel-2, Landsat, NDVI va spektral tahlil'
    },
    {
      id: 'cadastre',
      label: language === 'ru' ? 'Кадастр и 3D' : language === 'en' ? 'Cadastre & 3D' : 'Kadastr va Geodeziya',
      icon: Building2,
      desc: language === 'ru' ? 'Землеустройство, GNSS RTK и DEM/DSM' : language === 'en' ? 'Land cadastre, GNSS RTK & DEM/DSM' : 'Yer fondi, GNSS RTK, ortofotoplan va 3D DEM'
    }
  ];

  const modelOptions: { id: ChatModel; label: string; tag: string }[] = [
    {
      id: 'gemini-3.5-flash',
      label: 'Gemini 3.5 Flash',
      tag: language === 'ru' ? 'Стандарт (Быстрый и умный)' : language === 'en' ? 'Standard (Smart & balanced)' : 'Standart (Tezkor va aqlli)'
    },
    {
      id: 'gemini-3.1-flash-lite',
      label: 'Gemini 3.1 Flash Lite',
      tag: language === 'ru' ? 'Ультра-быстрый' : language === 'en' ? 'Ultra-fast' : 'O\'ta tezkor'
    },
    {
      id: 'gemini-3.1-pro-preview',
      label: 'Gemini 3.1 Pro Preview',
      tag: language === 'ru' ? 'Глубокий анализ (Комплексный)' : language === 'en' ? 'Deep Analysis (Complex STEM)' : 'Chuqur tahlil (Murakkab)'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          role: selectedRole
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server xatosi: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Kechirasiz, javob olishda muammo yuz berdi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: language === 'ru'
          ? `Произошла ошибка при обращении к ИИ: ${err.message || 'Сбой сети'}. Попробуйте снова через несколько секунд.`
          : language === 'en'
          ? `Error connecting to AI: ${err.message || 'Network issue'}. Please retry in a moment.`
          : `AI xizmatiga murojaat qilishda xatolik yuz berdi: ${err.message || 'Aloqa uzildi'}. Iltimos, qayta urinib ko'ring.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'ru' ? 'Очистить историю чата?' : language === 'en' ? 'Clear chat history?' : 'Suhbat tarixini tozalashni tasdiqlaysizmi?')) {
      setMessages(initialMessages);
      localStorage.removeItem('hayitali_gis_chat_history_v1');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeRoleData = roleOptions.find(r => r.id === selectedRole) || roleOptions[0];
  const ActiveRoleIcon = activeRoleData.icon;

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open GIS AI Assistant"
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 border border-emerald-400/40 focus:outline-none"
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping" />
            <div className="relative w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md flex items-center justify-center border border-emerald-400/50">
              <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5 text-white drop-shadow">
              <span>GIS AI Chatbot</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-[11px] text-emerald-100/90 font-medium">
              {language === 'ru' ? 'Задать вопрос эксперту' : language === 'en' ? 'Ask GIS Assistant' : 'Savol berish / Tahlil'}
            </div>
          </div>
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-out shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-slate-700/80 bg-slate-950/95 backdrop-blur-xl ${
            isMinimized 
              ? 'bottom-5 right-5 w-80 sm:w-96 h-16' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] md:w-[500px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ActiveRoleIcon className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    Hayitali GIS AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini 3
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {activeRoleData.label} • {selectedModel.replace('gemini-', '')}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title={language === 'ru' ? 'Очистить историю' : language === 'en' ? 'Clear history' : 'Tarixni tozalash'}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Kengaytirish' : 'Kichraytirish'}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title={language === 'ru' ? 'Закрыть' : language === 'en' ? 'Close' : 'Yopish'}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Role & Model Controls Strip */}
              <div className="bg-slate-900/80 px-3 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
                {/* Role selector dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Rol:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as ChatRole)}
                    className="bg-slate-950 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700/70 focus:outline-none focus:border-emerald-500/50"
                  >
                    {roleOptions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model selector dropdown */}
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ChatModel)}
                    className="bg-slate-950 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700/70 focus:outline-none focus:border-cyan-500/50"
                  >
                    {modelOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id === 'gemini-3.5-flash' ? '⚡ 3.5 Flash' : m.id === 'gemini-3.1-flash-lite' ? '🚀 3.1 Lite' : '🧠 3.1 Pro'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scrollable Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm custom-scrollbar bg-slate-950/40">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}

                      <div className={`relative max-w-[85%] rounded-2xl p-3 shadow-md ${
                        isUser 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs' 
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-tl-xs'
                      }`}>
                        <div className="whitespace-pre-wrap leading-relaxed break-words font-sans">
                          {msg.content}
                        </div>

                        <div className={`mt-1.5 flex items-center justify-between gap-2 text-[10px] ${
                          isUser ? 'text-emerald-200/80' : 'text-slate-400'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <div className="flex items-center gap-1.5">
                              {msg.modelUsed && (
                                <span className="font-mono text-[9px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded">
                                  {msg.modelUsed.replace('gemini-', '')}
                                </span>
                              )}
                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                title="Nusxa olish"
                                className="hover:text-white transition"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-2.5 justify-start items-center">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 animate-spin">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-300 flex items-center gap-2 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px] text-slate-400 font-mono">
                        {language === 'ru' ? 'Анализ геоданных...' : language === 'en' ? 'Analyzing geospatial data...' : 'Geofazoviy tahlil qilinmoqda...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Suggestions Chips */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 shrink-0">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{language === 'ru' ? 'Быстрые вопросы:' : language === 'en' ? 'Suggested prompts:' : 'Tezkor savollar:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-2.5 py-1 rounded-lg transition border border-slate-700/60 text-left line-clamp-1"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Box Area */}
              <div className="p-3 bg-slate-900 border-t border-slate-800/90 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2 bg-slate-950 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-emerald-500/60 transition"
                >
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      language === 'ru' 
                        ? 'Задайте вопрос по ГИС, проектам или технологиям...'
                        : language === 'en'
                        ? 'Ask about GIS projects, methodology, or tools...'
                        : 'GIS, 6 ta loyiha yoki tahlillar bo\'yicha savol bering...'
                    }
                    className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-2 py-1.5 resize-none max-h-28 focus:outline-none custom-scrollbar"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className={`p-2 rounded-lg transition shrink-0 ${
                      inputText.trim() && !isLoading
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
                  <span>Enter - yuborish, Shift+Enter - yangi qator</span>
                  <span className="text-emerald-400 font-mono">Gemini AI Studio API</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
