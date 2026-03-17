import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYVyG0_3hWaaGZRCqSSf3m7H6r9w9KtlU",
  authDomain: "musicplayermanager.firebaseapp.com",
  projectId: "musicplayermanager",
  storageBucket: "musicplayermanager.firebasestorage.app",
  messagingSenderId: "70241340472",
  appId: "1:70241340472:web:3891bbac865616a4a86acd",
  measurementId: "G-DWP0YPSR86"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);