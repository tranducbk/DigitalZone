import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvTnXdciSHWL8Cg8eXUrV-VVY1jit3wvk",
  authDomain: "digitalzone-831da.firebaseapp.com",
  projectId: "digitalzone-831da",
  storageBucket: "digitalzone-831da.firebasestorage.app",
  messagingSenderId: "735421909545",
  appId: "1:735421909545:web:4105ee49bf0fb59aea6a38",
  measurementId: "G-TZDZ10VCQX"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth, firebaseApp };