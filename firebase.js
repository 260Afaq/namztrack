// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDT2_gxVQ8eQ-wLgaYNCZEGSO2UMFTSgu4",
  authDomain: "tracker-786.firebaseapp.com",
  projectId: "tracker-786",
  storageBucket: "tracker-786.appspot.com",
  messagingSenderId: "663568637970",
  appId: "1:663568637970:web:49552ac723ddd4c5a5b8cb",
  measurementId: "G‑296C34TX2E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
