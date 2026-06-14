import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYIdkt0gZed1x5UJUmxnBubnblmnVfK1U",
  authDomain: "jittok-e6ab1.firebaseapp.com",
  projectId: "jittok-e6ab1",
  storageBucket: "jittok-e6ab1.firebasestorage.app",
  messagingSenderId: "552042510431",
  appId: "1:552042510431:web:ce99325d58616d099743ea",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Your Firestore database ID is "default"
export const db = getFirestore(app, "default");