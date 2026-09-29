import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface SiteContentContextType {
  texts: Record<string, string>;
  getText: (key: string, fallback: string) => string;
  updateText: (key: string, value: string) => Promise<void>;
  updateMultipleTexts: (updates: Record<string, string>) => Promise<void>;
  resetText: (key: string) => Promise<void>;
  isEditMode: boolean;
  setIsEditMode: (enabled: boolean) => void;
  toggleEditMode: () => void;
  isSaving: boolean;
  lastSavedKey: string | null;
}

const LOCAL_STORAGE_TEXTS_KEY = 'gis_portfolio_site_texts_v1';
const SITE_CONTENT_DOC_PATH = 'texts';

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const { user, isSiteEditor } = useAuth();
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_TEXTS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Ignored
    }
    return {};
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedKey, setLastSavedKey] = useState<string | null>(null);

  // Sync real-time with Firestore doc 'site_content/texts'
  useEffect(() => {
    const contentRef = doc(db, 'site_content', SITE_CONTENT_DOC_PATH);

    // Initial load and real-time subscription
    const unsubscribe = onSnapshot(
      contentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const remoteTexts = (data.texts as Record<string, string>) || {};
          setTexts(remoteTexts);
          try {
            localStorage.setItem(LOCAL_STORAGE_TEXTS_KEY, JSON.stringify(remoteTexts));
          } catch {
            // Ignored
          }
        }
      },
      (error) => {
        console.warn("Notice: Realtime site_content subscription fallback to local cache:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const getText = (key: string, fallback: string): string => {
    if (texts[key] !== undefined && texts[key] !== '') {
      return texts[key];
    }
    return fallback;
  };

  const updateText = async (key: string, value: string) => {
    setIsSaving(true);
    const updatedTexts = { ...texts, [key]: value };
    setTexts(updatedTexts);
    try {
      localStorage.setItem(LOCAL_STORAGE_TEXTS_KEY, JSON.stringify(updatedTexts));
    } catch {
      // Ignored
    }

    try {
      const contentRef = doc(db, 'site_content', SITE_CONTENT_DOC_PATH);
      await setDoc(
        contentRef,
        {
          texts: updatedTexts,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        },
        { merge: true }
      );
      setLastSavedKey(key);
      setTimeout(() => setLastSavedKey(null), 3000);
    } catch (err) {
      console.error("Failed to sync text to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateMultipleTexts = async (updates: Record<string, string>) => {
    setIsSaving(true);
    const updatedTexts = { ...texts, ...updates };
    setTexts(updatedTexts);
    try {
      localStorage.setItem(LOCAL_STORAGE_TEXTS_KEY, JSON.stringify(updatedTexts));
    } catch {
      // Ignored
    }

    try {
      const contentRef = doc(db, 'site_content', SITE_CONTENT_DOC_PATH);
      await setDoc(
        contentRef,
        {
          texts: updatedTexts,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to sync texts batch to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const resetText = async (key: string) => {
    const updatedTexts = { ...texts };
    delete updatedTexts[key];
    setTexts(updatedTexts);
    try {
      localStorage.setItem(LOCAL_STORAGE_TEXTS_KEY, JSON.stringify(updatedTexts));
      const contentRef = doc(db, 'site_content', SITE_CONTENT_DOC_PATH);
      await setDoc(
        contentRef,
        {
          texts: updatedTexts,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to reset text in Firestore:", e);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <SiteContentContext.Provider
      value={{
        texts,
        getText,
        updateText,
        updateMultipleTexts,
        resetText,
        isEditMode: isSiteEditor && isEditMode,
        setIsEditMode,
        toggleEditMode,
        isSaving,
        lastSavedKey
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
