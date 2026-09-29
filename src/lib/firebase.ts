import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  memoryLocalCache, 
  setLogLevel 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Silence verbose internal connection warnings from Firestore SDK in iframe environments
try {
  setLogLevel('silent');
} catch {
  // ignore
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId and memory cache for resilient iframe connectivity
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalAutoDetectLongPolling: true,
  }, databaseId);
} catch {
  firestoreInstance = getFirestore(app, databaseId);
}

export const db = firestoreInstance;

export default app;
