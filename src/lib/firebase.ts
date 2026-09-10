import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// True once real NEXT_PUBLIC_FIREBASE_* values are set. Until then, getAuth()
// throws synchronously ("auth/invalid-api-key") - callers should check this
// first rather than relying on try/catch around every Firebase call.
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

// Lazily initialized and only ever called from client components: the
// Firebase JS SDK's auth persistence relies on browser-only storage.
function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}

// Signs into Firebase using the custom token minted by the Backend's
// GET /api/auth/firebase-token so Firestore Security Rules can authorize
// chat access for this patient.
export async function signInToFirebaseWithCustomToken(customToken: string) {
  return signInWithCustomToken(getFirebaseAuth(), customToken);
}

export async function signOutOfFirebase() {
  if (!auth) return;
  await signOut(auth);
}
