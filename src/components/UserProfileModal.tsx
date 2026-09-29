import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Calendar, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, userProfile, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const displayName = userProfile?.fullName || user?.displayName || "Foydalanuvchi";
  const displayEmail = userProfile?.email || user?.email || "Email kiritilmagan";
  const displayPhone = userProfile?.phoneNumber || "Kiritilmagan";
  const isVerified = userProfile?.isEmailVerified || user?.emailVerified;
  const memberDate = userProfile?.createdAt 
    ? new Date(userProfile.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Yangi a\'zo';

  // Initials for avatar
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <img 
                src="/assets/gis_logo_3d.png" 
                alt="3D GIS Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
              />
            </div>
            <h2 className="text-base font-bold text-white">Foydalanuvchi Profili</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-emerald-400 text-lg font-mono">
                {initials}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{displayName}</h3>
                {isVerified && (
                  <span title="Email tasdiqlangan" className="flex items-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-500/20 stroke-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{displayEmail}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Email Tasdiqlangan Akkaunt
                </span>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 shadow-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Ism va Familiya:
              </span>
              <span className="font-semibold text-white">{displayName}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 shadow-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telefon raqam:
              </span>
              <span className="font-mono font-semibold text-emerald-400">{displayPhone}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 shadow-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email:
              </span>
              <span className="font-mono text-slate-200">{displayEmail}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 shadow-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Ro'yxatdan o'tgan:
              </span>
              <span className="text-slate-300">{memberDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between gap-3 shadow-xs">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition shadow-xs"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
