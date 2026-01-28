/**
 * Front-end project helpers (optional).
 * You can use this later for filtering, search, or "featured" rendering.
 */

export function normalizeProjects(projects = []) {
  return projects.map((p) => ({
    ...p,
    featured: Boolean(p.featured),
    stack: Array.isArray(p.stack) ? p.stack : [],
    links: p.links ?? {},
  }));
}

/**
 * Example filter: only featured projects.
 */
export function onlyFeatured(projects = []) {
  return projects.filter((p) => p.featured);
}
