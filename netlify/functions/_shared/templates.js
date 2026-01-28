export function buildIndexPayload({ site, projects, meta = {} }) {
  return {
    site,
    projects,
    meta: {
      generatedAt: new Date().toISOString(),
      ...meta,
    },
  };
}
