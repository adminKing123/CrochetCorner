import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { getTaxonomyStore } from "@/lib/taxonomy/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    search: searchParams.get("search") || "",
    limit: Number(searchParams.get("limit") || 10),
    page: Number(searchParams.get("page") || 1),
    ids: searchParams.get("ids") || "",
    email:
      request.headers.get("x-admin-email") ||
      searchParams.get("email") ||
      "",
  };
}

function parseListQueryParams(request) {
  const { email, ...queryParams } = parseQueryParams(request);
  return { email, queryParams };
}

export function createPublicTaxonomyHandler(type) {
  return async function GET(request) {
    const store = getTaxonomyStore(type);

    if (!store) {
      return jsonError("Invalid taxonomy type.", 400);
    }

    try {
      const { queryParams } = parseListQueryParams(request);
      const result = store.search(queryParams);
      return jsonSuccess(result);
    } catch (error) {
      console.error(`${type} GET error:`, error);
      return jsonError(`Failed to load ${type}.`, 500);
    }
  };
}

export function createAdminTaxonomyListHandler(type) {
  return async function GET(request) {
    const { email, queryParams } = parseListQueryParams(request);
    const auth = requireAdminEmail(email);

    if (!auth.ok) {
      return auth.response;
    }

    const store = getTaxonomyStore(type);

    try {
      const result = store.listForAdmin(queryParams);
      return jsonSuccess(result);
    } catch (error) {
      console.error(`admin ${type} GET error:`, error);
      return jsonError(`Failed to load ${type}.`, 500);
    }
  };
}

export function createAdminTaxonomyCreateHandler(type) {
  return async function POST(request) {
    try {
      const body = await parseJsonBody(request);
      const auth = requireAdminEmail(body?.email);

      if (!auth.ok) {
        return auth.response;
      }

      const store = getTaxonomyStore(type);
      const result = store.create(body.item);

      if (!result.success) {
        return jsonError(result.error, 400);
      }

      return jsonSuccess({ item: result.item, message: "Created successfully." });
    } catch (error) {
      console.error(`admin ${type} POST error:`, error);
      return jsonError(`Failed to create ${type.slice(0, -1)}.`, 500);
    }
  };
}

export function createAdminTaxonomyItemHandlers(type) {
  return {
    async PUT(request, { params }) {
      try {
        const body = await parseJsonBody(request);
        const auth = requireAdminEmail(body?.email);

        if (!auth.ok) {
          return auth.response;
        }

        const { id } = await params;
        const store = getTaxonomyStore(type);
        const result = store.update(id, body.item);

        if (!result.success) {
          return jsonError(result.error, 400);
        }

        return jsonSuccess({ item: result.item, message: "Updated successfully." });
      } catch (error) {
        console.error(`admin ${type} PUT error:`, error);
        return jsonError(`Failed to update ${type.slice(0, -1)}.`, 500);
      }
    },
    async DELETE(request, { params }) {
      try {
        const body = await parseJsonBody(request);
        const auth = requireAdminEmail(body?.email);

        if (!auth.ok) {
          return auth.response;
        }

        const { id } = await params;
        const store = getTaxonomyStore(type);
        const result = store.delete(id);

        if (!result.success) {
          return jsonError(result.error, 404);
        }

        return jsonSuccess({ message: "Deleted successfully." });
      } catch (error) {
        console.error(`admin ${type} DELETE error:`, error);
        return jsonError(`Failed to delete ${type.slice(0, -1)}.`, 500);
      }
    },
  };
}
