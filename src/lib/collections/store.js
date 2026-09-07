import { COLLECTIONS_PAGE_SIZE, defaultCollections } from "@/lib/collections/defaults";
import { getProductById } from "@/lib/products/store";
import {
  normalizeCollection,
  sanitizeCollections,
  validateCollection,
} from "@/lib/collections/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  seedDocuments,
  setDocument,
  deleteDocument,
} from "@/lib/firebase/firestore";

const COLLECTION = FIRESTORE_COLLECTIONS.collections;

async function readAllCollections() {
  const collections = sanitizeCollections(await listDocuments(COLLECTION));

  if (!collections.length) {
    const seeded = sanitizeCollections(defaultCollections);
    await seedDocuments(COLLECTION, seeded);
    return seeded;
  }

  return collections;
}

async function clearOtherWeeklyCollections(activeId) {
  const collections = await readAllCollections();
  const updates = collections.filter(
    (item) => item.id !== activeId && item.isWeeklyCollection
  );

  await Promise.all(
    updates.map((item) =>
      setDocument(COLLECTION, item.id, {
        ...item,
        isWeeklyCollection: false,
        updatedAt: new Date().toISOString(),
      })
    )
  );
}

export async function getCollectionsQuery({
  page = 1,
  limit = COLLECTIONS_PAGE_SIZE,
  search = "",
  trending = "",
  weekly = "",
} = {}) {
  let collections = await readAllCollections();
  const query = search.trim().toLowerCase();

  if (query) {
    collections = collections.filter(
      (collection) =>
        collection.title.toLowerCase().includes(query) ||
        collection.description.toLowerCase().includes(query) ||
        collection.id.toLowerCase().includes(query)
    );
  }

  if (trending === "true") {
    collections = collections.filter((collection) => collection.isTrending);
  } else if (trending === "false") {
    collections = collections.filter((collection) => !collection.isTrending);
  }

  if (weekly === "true") {
    collections = collections.filter((collection) => collection.isWeeklyCollection);
  } else if (weekly === "false") {
    collections = collections.filter((collection) => !collection.isWeeklyCollection);
  }

  collections.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const { items, pagination } = paginateItems(collections, page, limit);
  return { collections: items, pagination };
}

export async function getCollectionProductsQuery(
  collectionId,
  { page = 1, limit = 12, search = "" } = {}
) {
  const collection = await getCollectionById(collectionId);

  if (!collection) {
    return null;
  }

  let products = (
    await Promise.all(collection.productIds.map((id) => getProductById(id)))
  ).filter(Boolean);

  const query = search.trim().toLowerCase();

  if (query) {
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );
  }

  const { items, pagination } = paginateItems(products, page, limit);
  return { collection, products: items, pagination };
}

export async function getCollectionById(id) {
  const collection = await getDocument(COLLECTION, id);
  return collection ? normalizeCollection(collection) : null;
}

export async function getWeeklyCollection() {
  const collections = await readAllCollections();
  return collections.find((collection) => collection.isWeeklyCollection) || null;
}

export async function createCollection(input) {
  const error = validateCollection(input);

  if (error) {
    return { success: false, error };
  }

  const collection = normalizeCollection({
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, collection.id, collection);

  if (collection.isWeeklyCollection) {
    await clearOtherWeeklyCollections(collection.id);
  }

  const saved = await getCollectionById(collection.id);
  return { success: true, collection: saved };
}

export async function updateCollection(id, input) {
  const existing = await getCollectionById(id);

  if (!existing) {
    return { success: false, error: "Collection not found." };
  }

  const error = validateCollection({ ...existing, ...input, id });

  if (error) {
    return { success: false, error };
  }

  const collection = normalizeCollection({
    ...existing,
    ...input,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, collection.id, collection);

  if (collection.isWeeklyCollection) {
    await clearOtherWeeklyCollections(collection.id);
  }

  const saved = await getCollectionById(collection.id);
  return { success: true, collection: saved };
}

export async function deleteCollection(id) {
  const existing = await getCollectionById(id);

  if (!existing) {
    return { success: false, error: "Collection not found." };
  }

  await deleteDocument(COLLECTION, id);
  return { success: true };
}
