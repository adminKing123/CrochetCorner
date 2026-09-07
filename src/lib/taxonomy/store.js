import fs from "fs";
import path from "path";
import { TAXONOMY_PAGE_SIZE, TAXONOMY_SEARCH_LIMIT } from "@/lib/taxonomy/defaults";
import {
  normalizeTaxonomyItem,
  sanitizeTaxonomyItems,
  validateTaxonomyItem,
} from "@/lib/taxonomy/validation";

export function createTaxonomyStore(fileName) {
  const STORE_PATH = path.join(process.cwd(), "data", fileName);

  function ensureStoreDir() {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  function readAll() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
        if (Array.isArray(data.items)) {
          return sanitizeTaxonomyItems(data.items);
        }
      }
    } catch {
      // Start empty.
    }

    return [];
  }

  function writeAll(items) {
    ensureStoreDir();
    fs.writeFileSync(STORE_PATH, JSON.stringify({ items }, null, 2));
  }

  function searchItems({
    search = "",
    limit = TAXONOMY_SEARCH_LIMIT,
    page = 1,
    ids = "",
  } = {}) {
    let items = readAll();

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

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * limit;

    return {
      items: items.slice(start, start + limit),
      pagination: { page: safePage, limit, total, totalPages },
    };
  }

  return {
    getAll: readAll,
    search: searchItems,
    getById(id) {
      return readAll().find((item) => item.id === id) || null;
    },
    getByIds(ids = []) {
      const idSet = new Set(ids);
      return readAll().filter((item) => idSet.has(item.id));
    },
    create(input) {
      const error = validateTaxonomyItem(input);
      if (error) return { success: false, error };

      const items = readAll();
      const item = normalizeTaxonomyItem({
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      items.unshift(item);
      writeAll(items);
      return { success: true, item };
    },
    update(id, input) {
      const items = readAll();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        return { success: false, error: "Item not found." };
      }

      const error = validateTaxonomyItem({ ...items[index], ...input, id });
      if (error) return { success: false, error };

      const item = normalizeTaxonomyItem(
        {
          ...items[index],
          ...input,
          id,
          createdAt: items[index].createdAt,
          updatedAt: new Date().toISOString(),
        },
        index
      );

      items[index] = item;
      writeAll(items);
      return { success: true, item };
    },
    delete(id) {
      const items = readAll();
      const nextItems = items.filter((item) => item.id !== id);

      if (nextItems.length === items.length) {
        return { success: false, error: "Item not found." };
      }

      writeAll(nextItems);
      return { success: true };
    },
    listForAdmin({ page = 1, search = "", limit = TAXONOMY_PAGE_SIZE } = {}) {
      return searchItems({ page, search, limit });
    },
  };
}

export const keysStore = createTaxonomyStore("keys.json");
export const categoriesStore = createTaxonomyStore("categories.json");

export const taxonomyStores = {
  keys: keysStore,
  categories: categoriesStore,
};

export function getTaxonomyStore(type) {
  return taxonomyStores[type] || null;
}
