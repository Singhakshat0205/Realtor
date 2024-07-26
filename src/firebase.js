// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1Fms5YND81zT1oiyXxqlovHIgFLBoH5Y",
  authDomain: "realtor-react-54390.firebaseapp.com",
  projectId: "realtor-react-54390",
  storageBucket: "realtor-react-54390.appspot.com",
  messagingSenderId: "529344118015",
  appId: "1:529344118015:web:bd994b43776d5fd90220ca"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()