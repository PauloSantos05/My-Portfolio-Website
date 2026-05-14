import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import localFirebaseConfig from '@/firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localFirebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localFirebaseConfig.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig);

// Resilient DB initialization
let dbInstance;
const configDbId = firebaseConfig.firestoreDatabaseId;

try {
  // If explicitly provided a database ID, use it. 
  // If "default" is provided, use standard getFirestore(app)
  if (configDbId && configDbId !== '(default)') {
    console.log('Initializing Firestore with Database ID:', configDbId);
    dbInstance = getFirestore(app, configDbId);
  } else {
    console.log('Initializing Firestore with (default) database');
    dbInstance = getFirestore(app);
  }
} catch (e) {
  console.error('Failed to initialize Firestore with provided ID, falling back to default:', e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
export const googleProvider = new GoogleAuthProvider();

// Connection check
async function testConnection() {
  try {
    const testDoc = doc(db, '_connection_test_', 'ping');
    await getDocFromServer(testDoc);
    console.log('--- Firestore Online ---');
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn('--- Firestore Access Denied (Check Rules) ---');
    } else {
      console.error('--- Firestore Connection Error:', error.message);
    }
  }
}
testConnection();
