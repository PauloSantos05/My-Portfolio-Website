import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connection check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log('Firebase Connected Successfully');
  } catch (error: any) {
    if (error?.message?.includes('offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.log("Firebase initialized (Connection test response: " + error.message + ")");
    }
  }
}
testConnection();
