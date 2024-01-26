// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvgP-tUxL1GEFYz1_lUMRLsL1PzqzioUU",
  authDomain: "super-barnacle.firebaseapp.com",
  projectId: "super-barnacle",
  storageBucket: "super-barnacle.appspot.com",
  messagingSenderId: "486345250368",
  appId: "1:486345250368:web:ff6af642d81a66dd6bf1a5",
  measurementId: "G-XJLKZ98REM",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
