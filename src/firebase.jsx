import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Environment variable'dan Firebase config'i al
const firebaseConfigJson = import.meta.env.VITE_FIREBASE_CONFIG;

if (!firebaseConfigJson) {
  throw new Error('VITE_FIREBASE_CONFIG environment variable is not set');
}

// JSON string'i parse et
const firebaseConfig = JSON.parse(firebaseConfigJson);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);