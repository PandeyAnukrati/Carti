// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // for authentication
import { getAnalytics } from "firebase/analytics"; // optional

const firebaseConfig = {
  apiKey: "AIzaSyD1-egw-nV9V6xRblDIpN2IIcvU1p0IXkw",
  authDomain: "ecommerce-3dc82.firebaseapp.com",
  projectId: "ecommerce-3dc82",
  storageBucket: "ecommerce-3dc82.appspot.com", // fix: added .app**spot**
  messagingSenderId: "616502309688",
  appId: "1:616502309688:web:637151d203af228a81c7cd",
  measurementId: "G-WDTPBEF9X7",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics (only works in production with HTTPS)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export Auth instance for use in SignIn/SignUp
export const auth = getAuth(app);
export default app;
