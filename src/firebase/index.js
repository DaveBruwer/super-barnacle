// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore"
import { authStore } from "../stores/authStore"
import { miscStore } from "../stores/miscStore"
import { resetLoanProps } from "../stores/loanStore"

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
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)

onAuthStateChanged(auth, async () => {
  await fetchUserInfo().then(() => {})
})

export function fetchUserInfo() {
  return new Promise((resolve, reject) => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) {
        getDoc(doc(db, "Users", auth.currentUser.uid))
          .then((userData) => {
            if (userData.exists()) {
              authStore.user = userData.data()
              miscStore.currentTheme = authStore.user.theme
              resolve("User data successfully retrieved.")
            } else {
              reject("User logged in but user record not found in database.")
            }
          })
          .then(() => {
            getDocs(
              collection(db, "Users", auth.currentUser.uid, "Loans")
            ).then((querySnapshot) => {
              querySnapshot.forEach((_doc) => {
                const docData = _doc.data()
                docData.bond.startingDate = docData.bond.startingDate.toDate()
                authStore.userLoans[docData.bond.name] = docData
              })
            })
          })
          .catch((error) => {
            reject(`Error during doc retrieval: ${error}`)
          })
      } else {
        authStore.user = null
        authStore.userLoans = {}
        resetLoanProps()
        resolve("No user logged in.")
      }
    })
  })
}
