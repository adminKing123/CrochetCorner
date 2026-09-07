import { UPLOAD_ALLOWED_MIME_TYPES, UPLOAD_MAX_BYTES } from "@/lib/uploads/defaults";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function sanitizeFilename(filename = "") {
  return filename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeUpload(upload = {}) {
  return {
    id: normalizeText(upload.id),
    title: normalizeText(upload.title),
    originalFilename: normalizeText(upload.originalFilename),
    githubPath: normalizeText(upload.githubPath),
    url: normalizeText(upload.url),
    githubSha: normalizeText(upload.githubSha),
    mimeType: normalizeText(upload.mimeType),
    size: Number(upload.size) || 0,
    createdAt: upload.createdAt || new Date().toISOString(),
    updatedAt: upload.updatedAt || new Date().toISOString(),
  };
}

export function sanitizeUploads(uploads = []) {
  return uploads.map((upload) => normalizeUpload(upload));
}

export function validateUploadFile(file) {
  if (!file) {
    return "Please choose an image file to upload.";
  }

  if (!UPLOAD_ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Only JPG, PNG, WebP, and GIF images are allowed.";
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

export function validateUploadTitle(title) {
  if (title && title.length > 120) {
    return "Title must be 120 characters or fewer.";
  }

  return null;
}
