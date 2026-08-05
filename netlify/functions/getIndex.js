import { Octokit } from "@octokit/rest";
import { ok, serverError } from "./_shared/response.js";
import { buildIndexPayload } from "./_shared/templates.js";

function env(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function getStaticSite() {
  return {
    title: env("PORTFOLIO_SITE_TITLE", "Lucas Lydio"),
    description: env(
      "PORTFOLIO_SITE_DESC",
      "Full Stack Software Engineer building enterprise web applications, REST APIs, and internal systems used by more than 3,000 people."
    ),
    author: {
      name: env("PORTFOLIO_AUTHOR", "Lucas Lydio"),
      role: env("PORTFOLIO_ROLE", "Full Stack Software Engineer"),
      location: env("PORTFOLIO_LOCATION", "Anapolis, GO, Brazil"),
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

  const { data } = await octokit.repos.listForUser({
    username,
    per_page: 100,
    sort: "updated",
    direction: "desc",
  });

  return data
    .filter((repo) => !repo.fork)
    .slice(0, 12)
    .map((repo) => ({
      title: repo.name,
      subtitle: repo.language ? `Repository in ${repo.language}` : "Repository",
      description: repo.description || "No description yet.",
      stack: repo.language ? [repo.language] : [],
      links: {
        repo: repo.html_url,
        live: repo.homepage || "",
      },
      image: null,
      status: "public",
      featured: false,
      meta: {
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
      },
    }));
}

export const handler = async () => {
  try {
    const githubProjects = await fetchGithubRepos();
    const payload = buildIndexPayload({
      site: getStaticSite(),
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
