import { ok, serverError } from "./_shared/response.js";
import { buildIndexPayload } from "./_shared/templates.js";

import { Octokit } from "@octokit/rest";

// Optional envs:
// - GITHUB_TOKEN (recommended to avoid rate limit)
// - GITHUB_USERNAME (to list public repos)
// - PORTFOLIO_SITE_TITLE (optional)
// - PORTFOLIO_AUTHOR (optional)

function env(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function getStaticSite() {
  return {
    title: env("PORTFOLIO_SITE_TITLE", "Lucas Lydio — Portfolio"),
    description: env("PORTFOLIO_SITE_DESC", "Portfolio de desenvolvimento: projetos, skills e contato."),
    author: {
      name: env("PORTFOLIO_AUTHOR", "Lucas Lydio"),
      role: env("PORTFOLIO_ROLE", "Full-stack Developer"),
      location: env("PORTFOLIO_LOCATION", "Brazil"),
    },
    links: {
      github: env("PORTFOLIO_GITHUB", ""),
      linkedin: env("PORTFOLIO_LINKEDIN", ""),
      email: env("PORTFOLIO_EMAIL", ""),
    },
  };
}

async function fetchGithubRepos() {
  const username = env("GITHUB_USERNAME");
  if (!username) return [];

  const token = env("GITHUB_TOKEN");
  const octokit = new Octokit(token ? { auth: token } : {});

  // list public repos (paginated: first 30 by default; we request 100)
  const { data } = await octokit.repos.listForUser({
    username,
    per_page: 100,
    sort: "updated",
    direction: "desc",
  });

  // Map to “project-like” objects (simple + safe)
  return data
    .filter((r) => !r.fork) // optional: ignore forks
    .slice(0, 12) // keep it small
    .map((r) => ({
      title: r.name,
      subtitle: r.language ? `Repo em ${r.language}` : "Repositório",
      description: r.description || "Sem descrição ainda.",
      stack: r.language ? [r.language] : [],
      links: {
        repo: r.html_url,
        live: r.homepage || "",
      },
      image: null,
      status: "public",
      featured: false,
      meta: {
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      },
    }));
}

export const handler = async () => {
  try {
    const site = getStaticSite();

    // GitHub enrichment (optional)
    const githubProjects = await fetchGithubRepos();

    // If you want, later we can also merge your src/data/projects.json
    // into the response (via Supabase or manual duplication).
    const payload = buildIndexPayload({
      site,
      projects: githubProjects,
      meta: { source: githubProjects.length ? "github" : "static" },
    });

    return ok(payload);
  } catch (err) {
    return serverError("Failed to build index payload", {
      error: String(err?.message || err),
    });
  }
};
