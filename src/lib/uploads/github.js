export function getGithubUploadConfig() {
  const owner = process.env.GITHUB1_USERNAME?.trim();
  const repo = process.env.GITHUB1_REPO_NAME?.trim();
  const branch = process.env.GITHUB1_BRANCH_NAME?.trim() || "main";
  const token = process.env.GITHUB1_TOKEN?.trim();
  const uploadsFolder = process.env.GITHUB1_UPLOADS_FOLDER?.trim() || "uploads";

  if (!owner || !repo || !token) {
    return null;
  }

  return { owner, repo, branch, token, uploadsFolder };
}

export function isGithubUploadConfigured() {
  return Boolean(getGithubUploadConfig());
}

function buildRawUrl({ owner, repo, branch }, githubPath) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${githubPath}`;
}

async function githubRequest(config, path, options = {}) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;

  const response = await fetch(`${url}${options.query || ""}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "GitHub request failed.";
    throw new Error(message);
  }

  return data;
}

export async function uploadFileToGithub({ githubPath, buffer, message, sha }) {
  const config = getGithubUploadConfig();
  if (!config) {
    throw new Error("GitHub upload is not configured.");
  }

  const body = {
    message,
    content: buffer.toString("base64"),
    branch: config.branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const data = await githubRequest(config, githubPath, {
    method: "PUT",
    body,
  });

  return {
    githubSha: data.content?.sha || "",
    url: data.content?.download_url || buildRawUrl(config, githubPath),
    rawUrl: buildRawUrl(config, githubPath),
  };
}

export async function deleteFileFromGithub({ githubPath, sha, message }) {
  const config = getGithubUploadConfig();
  if (!config) {
    throw new Error("GitHub upload is not configured.");
  }

  if (!sha) {
    throw new Error("Missing GitHub file reference for delete.");
  }

  await githubRequest(config, githubPath, {
    method: "DELETE",
    body: {
      message,
      sha,
      branch: config.branch,
    },
  });
}

export function buildGithubUploadPath(filename) {
  const config = getGithubUploadConfig();
  const folder = config?.uploadsFolder || "uploads";
  return `${folder}/${filename}`;
}
