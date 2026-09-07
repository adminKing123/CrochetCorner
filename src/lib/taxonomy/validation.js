import { generateId } from "@/lib/generate-id";

export function normalizeTaxonomyItem(item, index = 0) {
  return {
    id: item.id || generateId(),
    name: item.name?.trim() || `Item ${index + 1}`,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

export function validateTaxonomyItem(item) {
  const normalized = normalizeTaxonomyItem(item);

  if (!normalized.name) {
    return "Name is required.";
  }

  return null;
}

export function createEmptyTaxonomyItem() {
  return normalizeTaxonomyItem({ name: "" });
}

export function sanitizeTaxonomyItems(items) {
  return items.map((item, index) => normalizeTaxonomyItem(item, index));
}
