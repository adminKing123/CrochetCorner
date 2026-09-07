import { generateId } from "@/lib/generate-id";

export function normalizeCollection(collection, index = 0) {
  return {
    id: collection.id || generateId(),
    title: collection.title?.trim() || `Collection ${index + 1}`,
    description: collection.description?.trim() || "",
    imageSquare: collection.imageSquare?.trim() || "",
    imagePortrait: collection.imagePortrait?.trim() || "",
    productIds: Array.isArray(collection.productIds)
      ? collection.productIds.filter(Boolean)
      : [],
    isTrending: Boolean(collection.isTrending),
    isWeeklyCollection: Boolean(collection.isWeeklyCollection),
    createdAt: collection.createdAt || new Date().toISOString(),
    updatedAt: collection.updatedAt || new Date().toISOString(),
  };
}

export function validateCollection(collection) {
  const normalized = normalizeCollection(collection);

  if (!normalized.title) {
    return "Collection title is required.";
  }

  if (!normalized.imageSquare || !normalized.imagePortrait) {
    return "Both square (1:1) and portrait (2:3) image URLs are required.";
  }

  return null;
}

export function createEmptyCollection() {
  return normalizeCollection({
    title: "",
    description: "",
    imageSquare: "",
    imagePortrait: "",
    productIds: [],
    isTrending: false,
    isWeeklyCollection: false,
  });
}

export function sanitizeCollections(collections) {
  return collections.map((collection, index) => normalizeCollection(collection, index));
}
