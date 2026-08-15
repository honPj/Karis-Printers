// =============================================
// FIREBASE CONFIGURATION - KARIS PRINTERS
// =============================================

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// 🔴 REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDMK2f7GJuF88sDISf1kmZkky2ogkJ9upk",
  authDomain: "karisprinters.firebaseapp.com",
  projectId: "karisprinters",
  storageBucket: "karisprinters.firebasestorage.app",
  messagingSenderId: "61733680659",
  appId: "1:61733680659:web:057a4b6e20d076bcd271e6",
  measurementId: "G-ETBBYDM7TH"
};

// =============================================
// INITIALIZE FIREBASE
// =============================================

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

// =============================================
// EXPORT FOR USE IN OTHER FILES
// =============================================

export { app, auth, db };