import { cert, getApps, initializeApp, applicationDefault, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore, DocumentData } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'free-course-platform';

export function isFirestoreEnabled(): boolean {
  if (process.env.CATALOG_DRIVER === 'memory') return false;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return true;
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return true;
  if (process.env.FIREBASE_CONFIG) return true;
  return false;
}

function parseServiceAccount(): Record<string, string> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

export function getAdminDb(): Firestore {
  if (!getApps().length) {
    const json = parseServiceAccount();
    if (json) {
      initializeApp({
        credential: cert(json as ServiceAccount),
        projectId: json.project_id || PROJECT_ID,
      });
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: PROJECT_ID,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      initializeApp({
        credential: applicationDefault(),
        projectId: PROJECT_ID,
      });
    } else {
      initializeApp({ projectId: PROJECT_ID });
    }
  }

  return getFirestore();
}

export const COURSES_COLLECTION = 'courses';
