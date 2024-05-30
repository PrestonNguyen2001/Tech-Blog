// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9WkpxzUMj-pWFKNm2mNyk9Mh410IbyiY",
  authDomain: "tech-blog-58f75.firebaseapp.com",
  projectId: "tech-blog-58f75",
  storageBucket: "tech-blog-58f75.appspot.com",
  messagingSenderId: "948862803890",
  appId: "1:948862803890:web:c4dffcdde39cbf368d8eab",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
