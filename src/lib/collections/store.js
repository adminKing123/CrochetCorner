import fs from "fs";
import path from "path";
import { COLLECTIONS_PAGE_SIZE, defaultCollections } from "@/lib/collections/defaults";
import { getProductById } from "@/lib/products/store";
import {
  normalizeCollection,
  sanitizeCollections,
  validateCollection,
} from "@/lib/collections/validation";

const STORE_PATH = path.join(process.cwd(), "data", "collections.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAllCollections() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.collections)) {
        return sanitizeCollections(data.collections);
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return sanitizeCollections(defaultCollections);
}

function writeCollections(collections) {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ collections }, null, 2));
}

function clearOtherWeeklyCollections(collections, activeId) {
  return collections.map((item) => {
    if (item.id === activeId || !item.isWeeklyCollection) {
      return item;
    }

    return {
      ...item,
      isWeeklyCollection: false,
      updatedAt: new Date().toISOString(),
    };
  });
}

function persistCollections(collections, weeklyCollectionId = null) {
  const nextCollections = weeklyCollectionId
    ? clearOtherWeeklyCollections(collections, weeklyCollectionId)
    : collections;

  writeCollections(nextCollections);
  return nextCollections;
}

export function getCollectionsQuery({
  page = 1,
  limit = COLLECTIONS_PAGE_SIZE,
  search = "",
  trending = "",
  weekly = "",
} = {}) {
  let collections = readAllCollections();

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

  const total = collections.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    collections: collections.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export function getCollectionProductsQuery(
  collectionId,
  { page = 1, limit = 12, search = "" } = {}
) {
  const collection = getCollectionById(collectionId);

  if (!collection) {
    return null;
  }

  let products = collection.productIds.map((id) => getProductById(id)).filter(Boolean);

  const query = search.trim().toLowerCase();

  if (query) {
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );
  }

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    collection,
    products: products.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export function getCollectionById(id) {
  return readAllCollections().find((collection) => collection.id === id) || null;
}

export function getWeeklyCollection() {
  return readAllCollections().find((collection) => collection.isWeeklyCollection) || null;
}

export function createCollection(input) {
  const error = validateCollection(input);

  if (error) {
    return { success: false, error };
  }

  const collections = readAllCollections();
  const collection = normalizeCollection({
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  collections.unshift(collection);
  const nextCollections = persistCollections(
    collections,
    collection.isWeeklyCollection ? collection.id : null
  );

  return { success: true, collection: nextCollections.find((item) => item.id === collection.id) };
}

export function updateCollection(id, input) {
  const collections = readAllCollections();
  const index = collections.findIndex((collection) => collection.id === id);

  if (index === -1) {
    return { success: false, error: "Collection not found." };
  }

  const error = validateCollection({ ...collections[index], ...input, id });

  if (error) {
    return { success: false, error };
  }

  const collection = normalizeCollection(
    {
      ...collections[index],
      ...input,
      id,
      createdAt: collections[index].createdAt,
      updatedAt: new Date().toISOString(),
    },
    index
  );

  collections[index] = collection;
  const nextCollections = persistCollections(
    collections,
    collection.isWeeklyCollection ? collection.id : null
  );

  return {
    success: true,
    collection: nextCollections.find((item) => item.id === collection.id),
  };
}

export function deleteCollection(id) {
  const collections = readAllCollections();
  const nextCollections = collections.filter((collection) => collection.id !== id);

  if (nextCollections.length === collections.length) {
    return { success: false, error: "Collection not found." };
  }

  writeCollections(nextCollections);
  return { success: true };
}
