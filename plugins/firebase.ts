import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAG6QJeZ4uan0nb3d6gOeMpJDNi_XiUQAk",
  authDomain: "pghs-tasty-dinner.firebaseapp.com",
  databaseURL:
    "https://pghs-tasty-dinner-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pghs-tasty-dinner",
  storageBucket: "pghs-tasty-dinner.appspot.com",
  messagingSenderId: "1032659509868",
  appId: "1:1032659509868:web:e27a6009a6d9190497ee49",
  measurementId: "G-2LLFCHS9M4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);
const storage = getStorage(app);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:transition:finish", () => {
    getPerformance(app);
    getAnalytics(app);
  });

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  nuxtApp.vueApp.provide("db", db);
  nuxtApp.provide("db", db);

  nuxtApp.vueApp.provide("storage", storage);
  nuxtApp.provide("storage", storage);

  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});

export { db };
