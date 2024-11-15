// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo1_bRqUmMDYod66t7KnW2kbi9-UmJsE0",
  authDomain: "jp-project-4e5a8.firebaseapp.com",
  projectId: "jp-project-4e5a8",
  storageBucket: "jp-project-4e5a8.firebasestorage.app",
  messagingSenderId: "267672776761",
  appId: "1:267672776761:web:a0fdc7328d05d3b16e5de8",
  measurementId: "G-G2XLZ1P51Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// const analytics = getAnalytics(app);