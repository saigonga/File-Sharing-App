import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXqq6WVyQqau_W33cob0P_vvh7Mz79lNc",
  authDomain: "files-sharing-app-ea357.firebaseapp.com",
  projectId: "files-sharing-app-ea357",
  storageBucket: "files-sharing-app-ea357.firebasestorage.app",
  messagingSenderId: "176095679628",
  appId: "1:176095679628:web:139fe16e93b4ddeddb17a9",
  measurementId: "G-01JNFM4MJV"
};

const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const analytics = getAnalytics(app);

export{app, auth, analytics};