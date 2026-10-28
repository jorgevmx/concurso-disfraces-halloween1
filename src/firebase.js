import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAMUcajIKFOBtDU7lDB4eCq_fdKv3paWM",
  authDomain: "concursodisfraceshallowe-ca7c9.firebaseapp.com",
  projectId: "concursodisfraceshallowe-ca7c9",
  storageBucket: "concursodisfraceshallowe-ca7c9.firebasestorage.app",
  messagingSenderId: "1088350747474",
  appId: "1:1088350747474:web:dab238d009915bb890d88b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);