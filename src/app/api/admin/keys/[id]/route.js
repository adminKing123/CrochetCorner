import { createAdminTaxonomyItemHandlers } from "@/lib/taxonomy/api-handlers";

const handlers = createAdminTaxonomyItemHandlers("keys");

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
