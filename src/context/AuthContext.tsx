import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber?: string | null;
  emailVerified: boolean;
}

export const ADMIN_EMAILS = [
  'gulomovhayitali4455@gmail.com',
  'gulomovhayitali4455@gmai.com'
];

export const isEmailAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

interface AuthContextType {
  user: AppUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSiteEditor: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, phoneNumber: string, pass: string) => Promise<{ code: string; email: string; uid: string }>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<string>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_STORAGE_SESSION_KEY = 'gis_portfolio_active_session';

// Helper: Secure password hashing using Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}_gis_${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or sync user profile from Firestore
  const fetchUserProfile = async (uid: string, fallbackEmail?: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        const role = isEmailAdmin(data.email) ? 'superadmin' : (data.role || 'user');
        const enriched = { ...data, role };
        setUserProfile(enriched);
        setUser({
          uid: enriched.uid,
          displayName: enriched.fullName,
          email: enriched.email,
          phoneNumber: enriched.phoneNumber,
          emailVerified: enriched.isEmailVerified
        });
        return enriched;
      } else if (fallbackEmail) {
        const role = isEmailAdmin(fallbackEmail) ? 'superadmin' : 'user';
        const fallback: UserProfile = {
          uid,
          fullName: 'Foydalanuvchi',
          email: fallbackEmail,
          phoneNumber: '',
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
          role
        };
        setUserProfile(fallback);
        setUser({
          uid,
          displayName: fallback.fullName,
          email: fallback.email,
          emailVerified: false
        });
        return fallback;
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
    return null;
  };

  useEffect(() => {
    // 1. First check local session storage for persistent login
    const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed?.uid) {
          fetchUserProfile(parsed.uid, parsed.email);
        }
      } catch (e) {
        console.error('Failed to parse local session:', e);
      }
    }

    // 2. Also listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserProfile(currentUser.uid, currentUser.email || undefined);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (fullName: string, email: string, phoneNumber: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phoneNumber.trim();

    // Check if user already registered in Firestore
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', cleanEmail));
      const existing = await getDocs(q);
      if (!existing.empty) {
        throw new Error("Ushbu email manzil bilan avval ro'yxatdan o'tilgan. Iltimos, 'Kirish' bo'limidan kiring.");
      }
    } catch (e: any) {
      if (e?.message && e.message.includes("avval ro'yxatdan")) {
        throw e;
      }
      // If collection query fails, continue to check doc directly
    }

    let assignedUid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let usedFirebaseAuth = false;

    // Try native Firebase Auth first
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      assignedUid = cred.user.uid;
      usedFirebaseAuth = true;

      try {
        await updateProfile(cred.user, { displayName: cleanName });
        await sendEmailVerification(cred.user);
      } catch {
        // Native email verification optional
      }
    } catch (authError: any) {
      // If auth/operation-not-allowed is returned, fallback transparently to Firestore auth!
      console.warn("Firebase Auth operation status:", authError?.code, "- Using resilient Firestore authentication.");
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error("Ushbu email manzil bilan avval ro'yxatdan o'tilgan. Iltimos, 'Kirish' bo'limidan kiring.");
      }
    }

    // Generate secure salt & password hash for Firestore backup
    const salt = Math.random().toString(36).substring(2, 10);
    const passwordHash = await hashPassword(pass, salt);

    // Generate random 6-digit confirmation code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Firestore email_verifications
    const verificationRef = doc(db, 'email_verifications', cleanEmail);
    await setDoc(verificationRef, {
      email: cleanEmail,
      code: verificationCode,
      uid: assignedUid,
      fullName: cleanName,
      phoneNumber: cleanPhone,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    });

    // Also store user profile in users collection (unverified until code input)
    const userDocRef = doc(db, 'users', assignedUid);
    const initialProfile: UserProfile = {
      uid: assignedUid,
      fullName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      role: 'user'
    };

    await setDoc(userDocRef, {
      ...initialProfile,
      salt,
      passwordHash,
      authMethod: usedFirebaseAuth ? 'firebase' : 'firestore'
    });

    setUserProfile(initialProfile);
    setUser({
      uid: assignedUid,
      displayName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      emailVerified: false
    });

    return { code: verificationCode, email: cleanEmail, uid: assignedUid };
  };

  const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const verificationRef = doc(db, 'email_verifications', cleanEmail);
    const snap = await getDoc(verificationRef);

    if (!snap.exists()) {
      throw new Error("Tasdiqlash kodi topilmadi yoki muddati o'tgan. Iltimos qaytadan urinib ko'ring.");
    }

    const data = snap.data();
    if (data.code !== code.trim()) {
      throw new Error("Kiritilgan 6 xonali tasdiqlash kodi noto'g'ri. Iltimos tekshirib qayta kiriting.");
    }

    const targetUid = data.uid || user?.uid;
    if (!targetUid) {
      throw new Error("Foydalanuvchi ma'lumotlari aniqlanmadi.");
    }

    // Mark as verified in users collection
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(userDocRef, {
      isEmailVerified: true,
      verifiedAt: new Date().toISOString()
    }, { merge: true });

    const verifiedProfile: UserProfile = {
      uid: targetUid,
      fullName: data.fullName || userProfile?.fullName || 'Foydalanuvchi',
      email: cleanEmail,
      phoneNumber: data.phoneNumber || userProfile?.phoneNumber || '',
      isEmailVerified: true,
      createdAt: data.createdAt || new Date().toISOString(),
      role: 'user'
    };

    setUserProfile(verifiedProfile);
    setUser({
      uid: targetUid,
      displayName: verifiedProfile.fullName,
      email: verifiedProfile.email,
      phoneNumber: verifiedProfile.phoneNumber,
      emailVerified: true
    });

    // Save session in localStorage for seamless persistent state
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(verifiedProfile));

    // Cleanup pending verification
    try {
      await deleteDoc(verificationRef);
    } catch (e) {
      console.log('Cleanup notice:', e);
    }

    return true;
  };

  const resendVerificationCode = async (email: string): Promise<string> => {
    const cleanEmail = email.trim().toLowerCase();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationRef = doc(db, 'email_verifications', cleanEmail);

    await setDoc(verificationRef, {
      email: cleanEmail,
      code: newCode,
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }, { merge: true });

    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch {
        // Optional
      }
    }

    return newCode;
  };

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth first
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      await fetchUserProfile(cred.user.uid, cred.user.email || undefined);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({
        uid: cred.user.uid,
        email: cleanEmail,
        fullName: cred.user.displayName || 'Foydalanuvchi'
      }));
      return;
    } catch (firebaseErr: any) {
      // If auth/operation-not-allowed or user not found in Firebase Auth, check Firestore!
      console.warn("Firebase Auth attempt notice:", firebaseErr?.code, "- Checking Firestore credentials...");
    }

    // 2. Check Firestore /users collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', cleanEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Ushbu email bilan ro'yxatdan o'tgan foydalanuvchi topilmadi.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.salt || !userData.passwordHash) {
      throw new Error("Akkaunt parolini tekshirishda xatolik yuz berdi. Iltimos qaytadan ro'yxatdan o'ting.");
    }

    const testHash = await hashPassword(pass, userData.salt);
    if (testHash !== userData.passwordHash) {
      throw new Error("Kiritilgan parol noto'g'ri. Iltimos tekshirib qayta kiriting.");
    }

    const role = isEmailAdmin(userData.email || cleanEmail) ? 'superadmin' : (userData.role || 'user');
    const profile: UserProfile = {
      uid: userData.uid || userDoc.id,
      fullName: userData.fullName || 'Foydalanuvchi',
      email: userData.email || cleanEmail,
      phoneNumber: userData.phoneNumber || '',
      isEmailVerified: userData.isEmailVerified ?? true,
      createdAt: userData.createdAt || new Date().toISOString(),
      role
    };

    setUserProfile(profile);
    setUser({
      uid: profile.uid,
      displayName: profile.fullName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      emailVerified: profile.isEmailVerified
    });

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignored
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.uid) {
      await fetchUserProfile(user.uid);
    }
  };

  const isAdmin = Boolean(
    isEmailAdmin(user?.email) || 
    isEmailAdmin(userProfile?.email) || 
    userProfile?.role === 'admin' || 
    userProfile?.role === 'superadmin'
  );
  const isSiteEditor = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        isSiteEditor,
        loading,
        login,
        register,
        verifyEmailCode,
        resendVerificationCode,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
