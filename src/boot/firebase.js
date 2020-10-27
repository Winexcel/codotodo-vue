import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


var firebaseConfig = {
  apiKey: "AIzaSyCFubZE37reasd56JBxMd5vtLnX_zqMeMQ",
  authDomain: "codotodo-d5508.firebaseapp.com",
  databaseURL: "https://codotodo-d5508.firebaseio.com",
  projectId: "codotodo-d5508",
  storageBucket: "codotodo-d5508.appspot.com",
  messagingSenderId: "609888123323",
  appId: "1:609888123323:web:8cf1d3a15c9e209ff46c9e"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebaseApp.auth();
const firebaseDB = firebaseApp.database();

export {firebaseApp, firebaseAuth, firebaseDB};

