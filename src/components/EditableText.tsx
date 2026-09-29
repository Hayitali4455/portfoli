import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'strong';
  multiline?: boolean;
  label?: string;
}

export default function EditableText({
  contentKey,
  defaultValue,
  className = '',
  as: Component = 'span',
  multiline = false,
  label
}: EditableTextProps) {
  const { getText, updateText, isEditMode, isSaving } = useSiteContent();
  const currentText = getText(contentKey, defaultValue);

  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(currentText);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Sync draft when remote text changes (while not editing)
  useEffect(() => {
    if (!isEditing) {
      setDraftText(currentText);
    }
  }, [currentText, isEditing]);

  // Focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraftText(currentText);
    setIsEditing(true);
  };

  const handleSave = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const trimmed = draftText.trim();
    if (trimmed !== currentText) {
      await updateText(contentKey, trimmed || defaultValue);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2200);
    }
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDraftText(currentText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      if (!multiline || e.ctrlKey || e.metaKey) {
        handleSave();
      }
    }
  };

  // If not superadmin edit mode, render cleanly with zero administrative wrappers
  if (!isEditMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  // Active Inline Editing State
  if (isEditing) {
    return (
      <span
        className="inline-block relative z-30 p-1.5 rounded-xl bg-slate-900 border-2 border-emerald-500 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150 min-w-[200px] max-w-full my-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="block text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
          <span>Tahrirlash: {label || contentKey}</span>
          <span className="text-slate-400 font-normal">Enter: Saqlash | Esc: Bekor</span>
        </span>

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full bg-slate-950 text-white rounded-lg p-2 text-sm font-sans border border-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-sans border border-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
        )}

        <div className="flex items-center justify-end gap-1.5 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow-md shadow-emerald-500/20"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Saqlash (Barcha uchun)
          </button>
        </div>
      </span>
    );
  }

  // Hoverable / Editable Presentation for Admin
  return (
    <span
      onClick={handleStartEdit}
      className={`group/edit relative inline-block cursor-pointer rounded-sm transition-all duration-150 outline-none hover:ring-2 hover:ring-emerald-400/80 hover:bg-emerald-500/10 px-0.5 ${className}`}
      title="Ushbu yozuvni o'zgartirish uchun bosing (Admin ruxsati bilan barcha foydalanuvchilarga o'zgaradi)"
    >
      <Component className="inline">{currentText}</Component>
      
      {/* Floating subtle pencil on hover */}
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-bold shadow-md align-middle select-none pointer-events-none scale-90">
        <Edit3 className="w-2.5 h-2.5" />
        <span>Tahrirlash</span>
      </span>

      {/* Instant saved feedback badge */}
      {showSavedFeedback && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xl flex items-center gap-1 animate-in fade-in duration-200 select-none whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          <span>Saqlandi & Barcha uchun yangilandi!</span>
        </span>
      )}
    </span>
  );
}
