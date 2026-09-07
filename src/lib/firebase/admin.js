import admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length) {
    return admin.apps[0];
  }

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.PROJECTID;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({ projectId });
  }

  return null;
}

export function getAdminAuth() {
  const app = getAdminApp();
  return app ? admin.auth(app) : null;
}

export function isAdminConfigured() {
  return Boolean(getAdminApp());
}
