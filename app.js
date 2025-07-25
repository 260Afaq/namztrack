// app.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupButton = document.getElementById("signup-button");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const prayerButtons = document.querySelectorAll(".prayer-btn");
const historyTable = document.querySelector("#history-table tbody");

signupButton.onclick = () => {
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .catch(err => alert(err.message));
};

loginButton.onclick = () => {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .catch(err => alert(err.message));
};

logoutButton.onclick = () => {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadToday(user.uid);
    loadHistory(user.uid);
  } else {
    dashboard.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
});

async function loadToday(uid) {
  const today = new Date().toISOString().slice(0,10);
  const docRef = doc(db, "users", uid, "days", today);
  const snap = await getDoc(docRef);
  const data = snap.exists() ? snap.data() : {};
  prayerButtons.forEach(btn => {
    const p = btn.dataset.prayer;
    if (data[p]) btn.classList.add("done");
    btn.onclick = () => markPrayer(uid, today, p, btn);
  });
}

async function markPrayer(uid, date, prayer, btn) {
  const docRef = doc(db, "users", uid, "days", date);
  await setDoc(docRef, { [prayer]: true }, { merge: true });
  btn.classList.add("done");
  loadHistory(uid);
}

// sync function loadHistory(uid) {
  try {
    historyTable.innerHTML = "";

    const col = collection(db, "users", uid, "days");
    const q = query(col, orderBy("__name__", "desc")); // ordering by document ID (date)

    const snap = await getDocs(q);

    if (snap.empty) {
      historyTable.innerHTML = `<tr><td colspan="6">No prayer history found.</td></tr>`;
      
    }

    snap.forEach(docSnap => {
      const date = docSnap.id;
      const data = docSnap.data();

      console.log("Loading history for uid:", uid);
console.log("Query snapshot size:", snap.size);
snap.forEach(docSnap => {
  console.log("Document ID:", docSnap.id, "Data:", docSnap.data());
  // ...build row
});

      // Use toUpperCase() matching if your prayer keys are case-insensitive
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${data.Fajr ? "✔️" : "❌"}</td>
        <td>${data.Dhuhr ? "✔️" : "❌"}</td>
        <td>${data.Asr ? "✔️" : "❌"}</td>
        <td>${data.Maghrib ? "✔️" : "❌"}</td>
        <td>${data.Isha ? "✔️" : "❌"}</td>
      `;
      historyTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading history:", error);
    historyTable.innerHTML = `<tr><td colspan="6">Error loading history</td></tr>`;
  }



  

a