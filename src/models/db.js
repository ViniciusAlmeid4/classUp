// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY_JSON || '{}');

  app = initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export { db };