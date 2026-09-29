import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  Laptop, 
  Smartphone, 
  ExternalLink, 
  Send, 
  Info
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // The permanent accessible public URL
  const publicUrl = "https://ais-pre-cvtvskewg5uxnbuhvnojcr-257551510799.asia-southeast1.run.app";

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = publicUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("Hayitali G'ulomov - GIS va Fazoviy Tahlillar Portfoliosi:")}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("Hayitali G'ulomov - GIS Portfoliosi: " + publicUrl)}`;

  // Quick QR code API via qrserver
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}&bgcolor=020617&color=10b981&margin=4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Saytni Boshqa Kompyuterda Ochish</h2>
              <p className="text-xs text-slate-400">Boshqa qurilmalar yoki brauzerlar uchun doimiy ochiq havola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Main URL Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sizning Portfoliongizning Umumiy Havolasi (URL):</span>
            </label>
            <div className="flex items-center gap-2 bg-slate-950 rounded-xl p-2 pl-3 shadow-inner">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full bg-transparent text-xs font-mono text-emerald-400 focus:outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxalash</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3" />
                Havola nusxalandi! Boshqa kompyuteringizga Telegram yoki xabar orqali yuborishingiz mumkin.
              </p>
            )}
          </div>

          {/* Device Instructions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Computer Instruction */}
            <div className="bg-slate-950/60 rounded-xl p-3 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Boshqa kompyuterda ochish:</span>
              </div>
              <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Boshqa kompyuterda <strong>Chrome</strong> yoki brauzerni oching.</li>
                <li>Yuqoridagi manzil satriga (URL bar) nusxalangan havolani qo'ying.</li>
                <li><strong>Enter</strong> tugmasini bosing — sayt bir zumda ochiladi!</li>
              </ol>
            </div>

            {/* Phone / Tablet QR Code */}
            <div className="bg-slate-950/60 rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-20 h-20 rounded-lg p-1 bg-slate-950 shrink-0 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Telefonda ochish:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Telefon kamerangizni QR-kodga qarating va saytni darhol oching.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Share to Yourself */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-2">
              Boshqa kompyuterga havolani tezda yuborish:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram orqali yuborish</span>
              </a>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>WhatsApp orqali yuborish</span>
              </a>
            </div>
          </div>

          {/* Google Search Explanation Box */}
          <div className="bg-amber-500/10 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed shadow-sm">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Nega Google qidiruvida darhol chiqmasligi mumkin?</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Google yangi veb-saytlarni indekslashi va qidiruv natijalariga qo'shishi uchun odatda bir necha kun vaqt ketadi. Shuning uchun hozirda boshqa kompyuterdan saytni topish va kirish uchun yuqoridagi <strong>to'g'ridan-to'g'ri havoladan</strong> foydalanish eng to'g'ri va tezkor yo'ldir.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 flex justify-end shadow-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition shadow-xs"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
