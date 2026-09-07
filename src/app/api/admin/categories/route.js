import {
  createAdminTaxonomyCreateHandler,
  createAdminTaxonomyListHandler,
} from "@/lib/taxonomy/api-handlers";

export const GET = createAdminTaxonomyListHandler("categories");
export const POST = createAdminTaxonomyCreateHandler("categories");
