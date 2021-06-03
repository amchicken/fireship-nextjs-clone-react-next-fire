import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqe_ski6EigXJe_Lwx2BNKiLwJXpgOfjw",
  authDomain: "fir-next-fire-app.firebaseapp.com",
  projectId: "fir-next-fire-app",
  storageBucket: "fir-next-fire-app.appspot.com",
  messagingSenderId: "229015939564",
  appId: "1:229015939564:web:ad7d1df4b078db4c37f8c9",
};

// Initialize Firebase
if (!firebase.apps.length > 0) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// helper functions

/**
 * gets a users/{uid} document with username
 *  @param {string} username
 */

export async function getUserWithUsername(username) {
  const userRef = firestore.collection("users");
  const query = userRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt?.toMillis(),
    updatedAt: data?.updatedAt?.toMillis(),
  };
}
/**
 * Converts a number to Firestore Timestamp
 * @param {number} milliseconds
 */

export const toFirebaseTimeStamp = (time) =>
  firebase.firestore.Timestamp.fromMillis(time);
