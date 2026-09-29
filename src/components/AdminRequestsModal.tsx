import React, { useState } from 'react';
import { 
  X, ShieldCheck, Check, Clock, AlertCircle, Trash2, CheckCircle2, 
  User, Mail, FileArchive, Calendar, Search, Maximize2, Minimize2
} from 'lucide-react';
import { useDownloadPermissions } from '../context/DownloadPermissionsContext';

interface AdminRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminRequestsModal({ isOpen, onClose }: AdminRequestsModalProps) {
  const { requests, approveRequest, rejectRequest } = useDownloadPermissions();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(true);

  if (!isOpen) return null;

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = !search || 
      r.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div 
      className={`fixed inset-0 z-50 flex animate-in fade-in duration-200 ${
        isFullscreen 
          ? 'w-screen h-screen p-0 bg-slate-950' 
          : 'items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto'
      }`}
    >
      <div 
        className={`relative flex flex-col bg-slate-900 shadow-2xl overflow-hidden transition-all duration-150 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'w-full max-w-4xl rounded-2xl max-h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-slate-900/95 sticky top-0 z-20 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Dasturlarni Yuklab Olish Ruxsatlari</h2>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300">
                    {pendingCount} kutilmoqda
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Admin (Hayitali G'ulomov) nazorati: foydalanuvchilarning yuklab olish so'rovlarini tasdiqlash</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? "Oyna rejimiga qaytish" : "To'liq ekranga yoyish"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Oynani yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kutilmoqda ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ruxsat berilgan ({requests.filter(r => r.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'rejected'
                  ? 'bg-red-500/20 text-red-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rad etilgan ({requests.filter(r => r.status === 'rejected').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barchasi ({requests.length})
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish (ism, email, loyiha)..."
              className="w-full bg-slate-950/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 flex-1">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileArchive className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
              <p className="text-sm font-medium">Hozircha hech qanday so'rov mavjud emas.</p>
              <p className="text-xs text-slate-600 mt-1">Foydalanuvchilar AI va GIS dasturlarini yuklab olish uchun ruxsat so'raganda bu yerda paydo bo'ladi.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950/60 shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white">{req.projectTitle}</span>
                    {req.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Kutilmoqda
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ruxsat berilgan
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Rad etilgan
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3 text-purple-400" /> {req.userName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" /> {req.userEmail}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3" /> {new Date(req.requestedAt).toLocaleDateString('uz-UZ')} {new Date(req.requestedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-lg">
                      "{req.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status !== 'approved' && (
                    <button
                      onClick={() => approveRequest(req.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Ruxsat berish</span>
                    </button>
                  )}
                  {req.status !== 'rejected' && (
                    <button
                      onClick={() => rejectRequest(req.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Rad etish</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-slate-900/90 flex items-center justify-between text-xs text-slate-500 shadow-inner">
          <span>Tizim himoyalangan: Dasturlar faqat admin ruxsati bilan yuklab olinadi.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
