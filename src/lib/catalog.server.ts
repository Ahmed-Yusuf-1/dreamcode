/**
 * Builds the lightweight catalog from the full content. Import this only from
 * server code (layouts, pages, route handlers): it pulls in every lesson body.
 */
import { lessons, lessonTrack, moduleOf } from "@/lib/curriculum";
import { badges, challenges, moduleChallenges, practiceDatasets, projects } from "@/lib/data";
import { trackFromLanguage, type Catalog } from "@/lib/catalog";

let cached: Catalog | null = null;

export function buildCatalog(): Catalog {
  if (cached) return cached;
  const sectionOf = new Map<string, string>();
  for (const [moduleName, slug] of Object.entries(moduleChallenges)) sectionOf.set(slug, moduleName);

  cached = {
    lessons: lessons.map((l) => ({
      slug: l.slug,
      order: l.order,
      track: lessonTrack(l),
      module: moduleOf(l),
      tier: l.tier || "beginner",
      title: l.title,
      catalogTitle: l.catalogTitle,
      blurb: l.blurb,
      catalogCode: l.catalogCode,
      runnable: l.runnable !== false,
      ...(l.practiceSlug && practiceDatasets[l.practiceSlug] ? { practiceSlug: l.practiceSlug } : {}),
      hasTask: !!l.task,
    })),
    challenges: Object.values(challenges).map((c) => ({
      slug: c.slug,
      name: c.name,
      level: c.level,
      language: c.language,
      track: trackFromLanguage(c.language),
      xp: c.xp,
      blurb: c.blurb,
      ...(sectionOf.has(c.slug) ? { module: sectionOf.get(c.slug) } : {}),
      ...(c.requires ? { requires: c.requires } : {}),
    })),
    projects: projects.map((p) => ({
      id: p.id,
      tier: p.tier,
      title: p.title,
      desc: p.desc,
      xp: p.xp,
      language: p.language,
      track: trackFromLanguage(p.language),
      requires: p.requires ?? [],
    })),
    badges,
  };
  return cached;
}
