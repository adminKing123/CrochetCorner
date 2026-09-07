import { TAXONOMY_PAGE_SIZE, TAXONOMY_SEARCH_LIMIT } from "@/lib/taxonomy/defaults";
import {
  normalizeTaxonomyItem,
  sanitizeTaxonomyItems,
  validateTaxonomyItem,
} from "@/lib/taxonomy/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  setDocument,
  deleteDocument,
} from "@/lib/firebase/firestore";

export function createTaxonomyStore(collectionName) {
  async function readAll() {
    return sanitizeTaxonomyItems(await listDocuments(collectionName));
  }

  async function searchItems({
    search = "",
    limit = TAXONOMY_SEARCH_LIMIT,
    page = 1,
    ids = "",
  } = {}) {
    let items = await readAll();

    if (ids) {
      const idSet = new Set(
        ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      );
      items = items.filter((item) => idSet.has(item.id));
      return {
        items: items.slice(0, limit),
        pagination: { page: 1, limit, total: items.length, totalPages: 1 },
      };
    }

    const query = search.trim().toLowerCase();

    if (query) {
      items = items.filter((item) => item.name.toLowerCase().includes(query));
    }

    items.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const { items: pagedItems, pagination } = paginateItems(items, page, limit);
    return { items: pagedItems, pagination };
  }

  return {
    getAll: readAll,
    search: searchItems,
    async getById(id) {
      const item = await getDocument(collectionName, id);
      return item ? normalizeTaxonomyItem(item) : null;
    },
    async getByIds(ids = []) {
      const idSet = new Set(ids);
      const items = await readAll();
      return items.filter((item) => idSet.has(item.id));
    },
    async create(input) {
      const error = validateTaxonomyItem(input);
      if (error) return { success: false, error };

      const item = normalizeTaxonomyItem({
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await setDocument(collectionName, item.id, item);
      return { success: true, item };
    },
    async update(id, input) {
      const existing = await getDocument(collectionName, id);

      if (!existing) {
        return { success: false, error: "Item not found." };
      }

      const error = validateTaxonomyItem({ ...existing, ...input, id });
      if (error) return { success: false, error };

      const item = normalizeTaxonomyItem({
        ...existing,
        ...input,
        id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      });

      await setDocument(collectionName, item.id, item);
      return { success: true, item };
    },
    async delete(id) {
      const existing = await getDocument(collectionName, id);

      if (!existing) {
        return { success: false, error: "Item not found." };
      }

      await deleteDocument(collectionName, id);
      return { success: true };
    },
    async listForAdmin({ page = 1, search = "", limit = TAXONOMY_PAGE_SIZE } = {}) {
      return searchItems({ page, search, limit });
    },
  };
}

export const keysStore = createTaxonomyStore(FIRESTORE_COLLECTIONS.keys);
export const categoriesStore = createTaxonomyStore(FIRESTORE_COLLECTIONS.categories);

export const taxonomyStores = {
  keys: keysStore,
  categories: categoriesStore,
};

export function getTaxonomyStore(type) {
  return taxonomyStores[type] || null;
}
