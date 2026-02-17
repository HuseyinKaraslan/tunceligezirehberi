import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDY2WRbemy5mkWM6_6-LNx_GQATCxIn3s",
    authDomain: "tunceli-gezi-rehberi.firebaseapp.com",
    projectId: "tunceli-gezi-rehberi",
    storageBucket: "tunceli-gezi-rehberi.firebasestorage.app",
    messagingSenderId: "85292963476",
    appId: "1:85292963476:web:27dbd8a68cc46052f00681"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);