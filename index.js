// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

require('dotenv').config();

// Document elements
const login = document.getElementById('Login');
const discussionContainer = document.getElementById('discussion-container');
const thread = document.getElementById('discuss');
const input = document.getElementById('message');
const discussion = document.getElementById('discussion');

var discussionListener = null;

async function main() {

  // Add Firebase project configuration object here
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "natureguild-925bc.firebaseapp.com",
    projectId: "natureguild-925bc",
    storageBucket: "natureguild-925bc.appspot.com",
    messagingSenderId: "373023705704",
    appId: "1:373023705704:web:a4f6f09d97e411afd449dd",
    measurementId: "G-E2JKJB7NKY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());

// login
login.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});
// ...
// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user) => {
 if (user){
   login.textContent = "LOGOUT";
   // Show discussion to logged-in users
  discussionContainer.style.display = "block";
   subscribeDiscussion();
 }
 else{
   login.textContent = "Login/ Register";
   // Hide discussion for non-logged-in users
  discussionContainer.style.display = "none";
   unsubscribeDiscussion();
 }
});

// ..
// Listen to the thread reply submission
thread.addEventListener("submit", (e) => {
 // Prevent the default thread redirect
 e.preventDefault();
 // Write a new message to the database collection "discussion"
 firebase.firestore().collection("discussion").add({
   text: input.value,
   timestamp: Date.now(),
   name: firebase.auth().currentUser.displayName,
   userId: firebase.auth().currentUser.uid
 })
 // clear message input field
 input.value = ""; 
 // Return false to avoid redirect
 return false;
});

// ...
// ...
// Listen to discussion updates
function subscribeDiscussion(){
   // Create query for messages
 discussionListener = firebase.firestore().collection("discussion")
 .orderBy("timestamp","desc")
 .onSnapshot((snaps) => {
   // Reset page
   discussion.innerHTML = "";
   // Loop through documents in database
   snaps.forEach((doc) => {
     // Create an HTML entry for each document and add it to the chat
     const entry = document.createElement("p");
     entry.textContent = doc.data().name + ": " + doc.data().text;
     discussion.appendChild(entry);
   });
 });
};

// ...
// Unsubscribe from discussion updates
function unsubscribeDiscussion(){
 if (discussionListener != null)
 {
   discussionListener();
   discussionListener = null;
 }
};

}


main();

