import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ehAwdkB3yn-1RceEgYq5XFLCR0cQMSQ",
  authDomain: "ecommerce-41547.firebaseapp.com",
  projectId: "ecommerce-41547",
  storageBucket: "ecommerce-41547.firebasestorage.app",
  messagingSenderId: "290344095264",
  appId: "1:290344095264:web:c57defb01026e79abb7645"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
