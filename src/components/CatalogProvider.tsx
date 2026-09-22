"use client";

import { createContext, useContext } from "react";
import type { Catalog } from "@/lib/catalog";
import { setClientCatalog } from "@/lib/catalogStore";

const CatalogContext = createContext<Catalog | null>(null);

/**
 * Makes the lightweight catalog (built once on the server by the root layout)
 * available to every client component, and to plain client modules such as the
 * reward rules through catalogStore.
 */
export default function CatalogProvider({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  // Registered during render so it is ready before any child effect runs.
  setClientCatalog(catalog);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used inside CatalogProvider");
  return catalog;
}
