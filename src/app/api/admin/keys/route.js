import {
  createAdminTaxonomyCreateHandler,
  createAdminTaxonomyListHandler,
} from "@/lib/taxonomy/api-handlers";

export const GET = createAdminTaxonomyListHandler("keys");
export const POST = createAdminTaxonomyCreateHandler("keys");
