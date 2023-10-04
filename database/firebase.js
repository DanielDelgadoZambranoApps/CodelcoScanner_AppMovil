import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
import "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDCHZlcB86UF7iLaUQ9mL4qUtuT2pDe-Dk",
    authDomain: "codelcoscannerfirebase.firebaseapp.com",
    projectId: "codelcoscannerfirebase",
    storageBucket: "codelcoscannerfirebase.appspot.com",
    messagingSenderId: "597832623039",
    appId: "1:597832623039:web:6937cf891390094e93f70a",
    measurementId: "G-BTKEGTY4DF"
};

const app  = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

