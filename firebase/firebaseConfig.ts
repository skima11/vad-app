// firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function missingEnv(name: string) {
  console.error(`[FIREBASE] missing env: ${name}`);
  return false;
}

const required = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(required).filter(([k, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.warn(
    `[FIREBASE] One or more Firebase env vars are missing: ${missing.join(
      ", "
    )}. Firebase will not be initialized.`
  );
}

/** Initialize app only when all required envs exist */
export const app =
  missing.length === 0
    ? !getApps().length
      ? initializeApp({
          apiKey: required.apiKey!,
          authDomain: required.authDomain!,
          projectId: required.projectId!,
          storageBucket: required.storageBucket!,
          messagingSenderId: required.messagingSenderId!,
          appId: required.appId!,
        })
      : getApp()
    : null;

// Export single instances if app exists — otherwise export nulls and safe getters
export const auth = app ? getAuth(app) : (null as any);
export const db = app ? getFirestore(app) : (null as any);
export const storage = app ? getStorage(app) : (null as any);
