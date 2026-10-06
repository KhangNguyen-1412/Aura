// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-BfkoWmpKkXvUwLgIo7dL4zCwcbOcAak",
  authDomain: "aura-47c9e.firebaseapp.com",
  projectId: "aura-47c9e",
  storageBucket: "aura-47c9e.firebasestorage.app",
  messagingSenderId: "425960133786",
  appId: "1:425960133786:web:2134059c058d7256233b23",
  measurementId: "G-9PBMQQ2B2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);