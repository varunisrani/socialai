// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPsG9zexwSJhq2owWi1LfZEkswr5xf8Ds",
  authDomain: "linkedin-clone-d873d.firebaseapp.com",
  projectId: "linkedin-clone-d873d",
  storageBucket: "linkedin-clone-d873d.appspot.com",
  messagingSenderId: "474369294841",
  appId: "1:474369294841:web:761b56a7deec52f677fd28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
