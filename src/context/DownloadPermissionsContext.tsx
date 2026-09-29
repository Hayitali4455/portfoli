import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { DownloadRequest } from '../types';

interface DownloadPermissionsContextType {
  requests: DownloadRequest[];
  loading: boolean;
  requestPermission: (projectId: string, projectTitle: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  getPermissionStatus: (projectId: string) => 'none' | 'pending' | 'approved' | 'rejected';
  pendingRequestsCount: number;
}

const STORAGE_KEY = 'gis_download_requests_v1';
const ADMIN_EMAIL = 'gulomovhayitali4455@gmail.com';

const DownloadPermissionsContext = createContext<DownloadPermissionsContextType | undefined>(undefined);

export function DownloadPermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();
  const [requests, setRequests] = useState<DownloadRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to load requests from localStorage", e);
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || userProfile?.role === 'admin';

  // Listen to Firestore updates if available, fallback to localStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const reqCol = collection(db, 'download_requests');
      unsubscribe = onSnapshot(reqCol, (snap) => {
        const list: DownloadRequest[] = [];
        snap.forEach((d) => {
          list.push(d.data() as DownloadRequest);
        });
        if (list.length > 0) {
          // Sort newest first
          list.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
          setRequests(list);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          } catch {
            // ignore
          }
        }
      }, (err) => {
        console.warn("Firestore download_requests listener error (using local state):", err.message);
      });
    } catch (e) {
      console.warn("Could not setup Firestore download_requests snapshot:", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save requests to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error("Failed to sync requests to localStorage", e);
    }
  }, [requests]);

  const requestPermission = async (
    projectId: string, 
    projectTitle: string, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user || !user.email) {
      return { 
        success: false, 
        message: "Ruxsat so'rash uchun avval akkauntingizga kirishingiz lozim." 
      };
    }

    if (isAdmin) {
      return {
        success: true,
        message: "Siz tizim adminsiz, sizga barcha fayllarni to'g'ridan-to'g'ri yuklab olishga ruxsat berilgan."
      };
    }

    const cleanEmail = user.email.toLowerCase().trim();
    const existing = requests.find(r => r.projectId === projectId && r.userEmail.toLowerCase() === cleanEmail);

    if (existing && existing.status === 'pending') {
      return {
        success: true,
        message: "Ushbu loyiha bo'yicha ruxsat so'rovingiz avval yuborilgan va admin ko'rib chiqishini kutmoqda."
      };
    }

    const newReq: DownloadRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      projectTitle,
      userEmail: cleanEmail,
      userName: user.displayName || userProfile?.fullName || 'Foydalanuvchi',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: notes || "Loyiha materiallari va dasturiy kodini yuklab olish uchun ruxsat so'rovi."
    };

    // Update local state immediately
    setRequests(prev => [newReq, ...prev.filter(r => !(r.projectId === projectId && r.userEmail.toLowerCase() === cleanEmail))]);

    // Update Firestore
    try {
      const docRef = doc(db, 'download_requests', newReq.id);
      await setDoc(docRef, newReq);
    } catch (e) {
      console.warn("Could not write download request to Firestore, saved locally:", e);
    }

    return {
      success: true,
      message: "Ruxsat so'rovingiz adminga (Hayitali G'ulomov) yuborildi. Tasdiqlanishi bilan faylni yuklab olishingiz mumkin."
    };
  };

  const approveRequest = async (requestId: string) => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved' as const,
          respondedAt: new Date().toISOString()
        };
      }
      return r;
    });
    setRequests(updated);

    try {
      const docRef = doc(db, 'download_requests', requestId);
      await updateDoc(docRef, {
        status: 'approved',
        respondedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Could not update request in Firestore, updated locally:", e);
    }
  };

  const rejectRequest = async (requestId: string) => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected' as const,
          respondedAt: new Date().toISOString()
        };
      }
      return r;
    });
    setRequests(updated);

    try {
      const docRef = doc(db, 'download_requests', requestId);
      await updateDoc(docRef, {
        status: 'rejected',
        respondedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Could not update request in Firestore, updated locally:", e);
    }
  };

  const getPermissionStatus = (projectId: string): 'none' | 'pending' | 'approved' | 'rejected' => {
    if (!user) return 'none';
    if (isAdmin) return 'approved';

    const cleanEmail = (user.email || '').toLowerCase().trim();
    const req = requests.find(r => r.projectId === projectId && r.userEmail.toLowerCase() === cleanEmail);
    if (!req) return 'none';
    return req.status;
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  return (
    <DownloadPermissionsContext.Provider
      value={{
        requests,
        loading,
        requestPermission,
        approveRequest,
        rejectRequest,
        getPermissionStatus,
        pendingRequestsCount
      }}
    >
      {children}
    </DownloadPermissionsContext.Provider>
  );
}

export function useDownloadPermissions() {
  const context = useContext(DownloadPermissionsContext);
  if (!context) {
    throw new Error('useDownloadPermissions must be used within DownloadPermissionsProvider');
  }
  return context;
}
