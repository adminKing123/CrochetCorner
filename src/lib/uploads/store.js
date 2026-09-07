import { generateId } from "@/lib/generate-id";
import {
  buildGithubUploadPath,
  deleteFileFromGithub,
  isGithubUploadConfigured,
  uploadFileToGithub,
} from "@/lib/uploads/github";
import { UPLOADS_PAGE_SIZE } from "@/lib/uploads/defaults";
import {
  normalizeUpload,
  sanitizeFilename,
  sanitizeUploads,
  validateUploadFile,
  validateUploadTitle,
} from "@/lib/uploads/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  setDocument,
  deleteDocument,
} from "@/lib/firebase/firestore";

const COLLECTION = FIRESTORE_COLLECTIONS.uploads;

async function readAllUploads() {
  return sanitizeUploads(await listDocuments(COLLECTION));
}

function buildStoredFilename(id, originalFilename) {
  const safeName = sanitizeFilename(originalFilename) || "image";
  return `${id}-${safeName}`;
}

export async function getUploadsQuery({ page = 1, limit = UPLOADS_PAGE_SIZE, search = "" } = {}) {
  let uploads = await readAllUploads();
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

  const { items, pagination } = paginateItems(uploads, page, limit);
  return { uploads: items, pagination };
}

export async function getUploadById(id) {
  const upload = await getDocument(COLLECTION, id);
  return upload ? normalizeUpload(upload) : null;
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

    await setDocument(COLLECTION, upload.id, upload);

    return { success: true, upload };
  } catch (error) {
    return { success: false, error: error.message || "Failed to upload image to GitHub." };
  }
}

export async function updateUpload(id, { file, title }) {
  const current = await getUploadById(id);

  if (!current) {
    return { success: false, error: "Upload not found." };
  }

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

    await setDocument(COLLECTION, id, updatedUpload);
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

    await setDocument(COLLECTION, id, updatedUpload);

    return { success: true, upload: updatedUpload };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update image on GitHub." };
  }
}

export async function deleteUpload(id) {
  const current = await getUploadById(id);

  if (!current) {
    return { success: false, error: "Upload not found." };
  }

  try {
    await deleteFileFromGithub({
      githubPath: current.githubPath,
      sha: current.githubSha,
      message: `Delete ${current.originalFilename}`,
    });

    await deleteDocument(COLLECTION, id);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete image from GitHub." };
  }
}
