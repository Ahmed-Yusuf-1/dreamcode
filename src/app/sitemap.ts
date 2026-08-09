import type { MetadataRoute } from "next";
import { lessons } from "@/lib/curriculum";
import { challenges, projects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamcoder.dev";
  const staticPaths = ["", "/start", "/lessons", "/journey", "/peaks", "/projects"];
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...lessons.map((lesson) => ({ url: `${base}/lesson/${lesson.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...Object.values(challenges).map((challenge) => ({ url: `${base}/challenge/${challenge.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...projects.map((project) => ({ url: `${base}/project/${project.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
