import fs from "fs";
import path from "path";
import { generateId } from "@/lib/generate-id";
import {
  buildGithubUploadPath,
  deleteFileFromGithub,
  isGithubUploadConfigured,
  uploadFileToGithub,
} from "@/lib/uploads/github";
import { UPLOADS_PAGE_SIZE, defaultUploads } from "@/lib/uploads/defaults";
import {
  normalizeUpload,
  sanitizeFilename,
  sanitizeUploads,
  validateUploadFile,
  validateUploadTitle,
} from "@/lib/uploads/validation";

const STORE_PATH = path.join(process.cwd(), "data", "uploads.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAllUploads() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.uploads)) {
        return sanitizeUploads(data.uploads);
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return sanitizeUploads(defaultUploads);
}

function writeUploads(uploads) {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ uploads }, null, 2));
}

function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

function buildStoredFilename(id, originalFilename) {
  const safeName = sanitizeFilename(originalFilename) || "image";
  return `${id}-${safeName}`;
}

export function getUploadsQuery({ page = 1, limit = UPLOADS_PAGE_SIZE, search = "" } = {}) {
  let uploads = readAllUploads();
  const query = search.trim().toLowerCase();

  if (query) {
    uploads = uploads.filter(
      (upload) =>
        upload.title.toLowerCase().includes(query) ||
        upload.originalFilename.toLowerCase().includes(query) ||
        upload.url.toLowerCase().includes(query) ||
        upload.githubPath.toLowerCase().includes(query)
    );
  }

  uploads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginate(uploads, page, limit);
  return { uploads: items, pagination };
}

export function getUploadById(id) {
  return readAllUploads().find((upload) => upload.id === id) || null;
}

export async function createUpload({ file, title = "" }) {
  if (!isGithubUploadConfigured()) {
    return { success: false, error: "GitHub upload is not configured on the server." };
  }

  const fileError = validateUploadFile(file);
  if (fileError) {
    return { success: false, error: fileError };
  }

  const titleError = validateUploadTitle(title);
  if (titleError) {
    return { success: false, error: titleError };
  }

  const id = generateId();
  const storedFilename = buildStoredFilename(id, file.name);
  const githubPath = buildGithubUploadPath(storedFilename);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const githubResult = await uploadFileToGithub({
      githubPath,
      buffer,
      message: `Upload ${file.name}`,
    });

    const now = new Date().toISOString();
    const upload = normalizeUpload({
      id,
      title: title || file.name,
      originalFilename: file.name,
      githubPath,
      url: githubResult.rawUrl,
      githubSha: githubResult.githubSha,
      mimeType: file.type,
      size: file.size,
      createdAt: now,
      updatedAt: now,
    });

    const uploads = readAllUploads();
    uploads.unshift(upload);
    writeUploads(uploads);

    return { success: true, upload };
  } catch (error) {
    return { success: false, error: error.message || "Failed to upload image to GitHub." };
  }
}

export async function updateUpload(id, { file, title }) {
  const uploads = readAllUploads();
  const index = uploads.findIndex((upload) => upload.id === id);

  if (index === -1) {
    return { success: false, error: "Upload not found." };
  }

  const current = uploads[index];
  const nextTitle = title !== undefined ? title.trim() : current.title;
  const titleError = validateUploadTitle(nextTitle);
  if (titleError) {
    return { success: false, error: titleError };
  }

  if (!file) {
    const updatedUpload = normalizeUpload({
      ...current,
      title: nextTitle || current.originalFilename,
      updatedAt: new Date().toISOString(),
    });

    uploads[index] = updatedUpload;
    writeUploads(uploads);
    return { success: true, upload: updatedUpload };
  }

  const fileError = validateUploadFile(file);
  if (fileError) {
    return { success: false, error: fileError };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const githubResult = await uploadFileToGithub({
      githubPath: current.githubPath,
      buffer,
      message: `Update ${current.originalFilename}`,
      sha: current.githubSha,
    });

    const updatedUpload = normalizeUpload({
      ...current,
      title: nextTitle || file.name,
      originalFilename: file.name,
      url: githubResult.rawUrl,
      githubSha: githubResult.githubSha,
      mimeType: file.type,
      size: file.size,
      updatedAt: new Date().toISOString(),
    });

    uploads[index] = updatedUpload;
    writeUploads(uploads);

    return { success: true, upload: updatedUpload };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update image on GitHub." };
  }
}

export async function deleteUpload(id) {
  const uploads = readAllUploads();
  const index = uploads.findIndex((upload) => upload.id === id);

  if (index === -1) {
    return { success: false, error: "Upload not found." };
  }

  const current = uploads[index];

  try {
    await deleteFileFromGithub({
      githubPath: current.githubPath,
      sha: current.githubSha,
      message: `Delete ${current.originalFilename}`,
    });

    uploads.splice(index, 1);
    writeUploads(uploads);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete image from GitHub." };
  }
}
