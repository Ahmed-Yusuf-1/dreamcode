import type { Catalog } from "@/lib/catalog";

/**
 * Module-level handle on the client catalog for non-React code (the profile and
 * reward helpers). CatalogProvider registers it on first render.
 */
let clientCatalog: Catalog | null = null;

export function setClientCatalog(catalog: Catalog) {
  clientCatalog = catalog;
}

export function getClientCatalog(): Catalog | null {
  return clientCatalog;
}
