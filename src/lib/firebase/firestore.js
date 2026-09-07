import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp, isAdminConfigured } from "@/lib/firebase/admin";

export const FIRESTORE_COLLECTIONS = {
  products: "products",
  collections: "collections",
  keys: "keys",
  categories: "categories",
  customOrders: "customOrders",
  shopOrders: "shopOrders",
  uploads: "uploads",
  authOtps: "authOtps",
  authVerifiedEmails: "authVerifiedEmails",
  authResetTokens: "authResetTokens",
  settings: "settings",
};

export function getAdminFirestore() {
  const app = getAdminApp();

  if (!app) {
    throw new Error("Firebase Admin is not configured.");
  }

  return getFirestore(app);
}

export function isFirestoreConfigured() {
  return isAdminConfigured();
}

function mapDoc(doc) {
  return { id: doc.id, ...doc.data() };
}

export async function listDocuments(collectionName) {
  const snapshot = await getAdminFirestore().collection(collectionName).get();
  return snapshot.docs.map(mapDoc);
}

export async function getDocument(collectionName, id) {
  const snapshot = await getAdminFirestore().collection(collectionName).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return mapDoc(snapshot);
}

export async function setDocument(collectionName, id, data) {
  await getAdminFirestore().collection(collectionName).doc(id).set(data);
}

export async function updateDocumentFields(collectionName, id, data) {
  await getAdminFirestore().collection(collectionName).doc(id).set(data, { merge: true });
}

export async function deleteDocument(collectionName, id) {
  await getAdminFirestore().collection(collectionName).doc(id).delete();
}

export async function seedDocuments(collectionName, items) {
  if (!items.length) {
    return;
  }

  const db = getAdminFirestore();
  const batch = db.batch();

  items.forEach((item) => {
    batch.set(db.collection(collectionName).doc(item.id), item);
  });

  await batch.commit();
}

export function paginateItems(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export function sanitizeFirestoreDocId(value) {
  return String(value).replace(/[/\\]/g, "_");
}
