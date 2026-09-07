"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import {
  createUploadAdmin,
  deleteUploadAdmin,
  fetchUploadsAdmin,
  updateUploadAdmin,
} from "@/lib/uploads/client-api";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, loading: authLoading } = useAdminUser();

  const [uploads, setUploads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const loadUploads = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchUploadsAdmin(email, { page, search });
      setUploads(data.uploads || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, page, search]);

  useEffect(() => {
    if (authLoading) return;
    loadUploads();
  }, [authLoading, loadUploads]);

  function updateQuery(next) {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.page && next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    router.push(`${adminRoutes.uploads}${query ? `?${query}` : ""}`);
  }

  async function handleUpload(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      await createUploadAdmin(email, { file: uploadFile, title: uploadTitle.trim() });
      setSuccess("Image uploaded to GitHub.");
      setUploadTitle("");
      setUploadFile(null);
      if (event.currentTarget instanceof HTMLFormElement) {
        event.currentTarget.reset();
      }
      loadUploads();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(upload) {
    setEditingId(upload.id);
    setEditTitle(upload.title);
    setEditFile(null);
  }

  function cancelEdit() {
    setEditingId("");
    setEditTitle("");
    setEditFile(null);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    if (!editingId) return;

    setError("");
    setSuccess("");
    setSavingEdit(true);

    try {
      await updateUploadAdmin(email, editingId, {
        title: editTitle.trim(),
        file: editFile,
      });
      setSuccess("Upload updated.");
      cancelEdit();
      loadUploads();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}" from GitHub and remove it from the library?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteUploadAdmin(email, id);
      setSuccess("Upload deleted.");
      if (editingId === id) cancelEdit();
      loadUploads();
    } catch (err) {
      setError(err.message);
    }
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess("Image URL copied to clipboard.");
    } catch {
      setError("Could not copy URL.");
    }
  }

  return (
    <AdminShell
      title="Upload Images"
      description="Upload images to GitHub and copy the public URL for products, collections, and hero slides."
    >
      <form
        onSubmit={handleUpload}
        className="mb-6 space-y-4 rounded-2xl border border-peach/20 bg-white p-4 md:p-5"
      >
        <h3 className="font-display text-xl font-bold text-charcoal">Upload new image</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <AuthInput
            label="Title (optional)"
            id="upload-title"
            value={uploadTitle}
            onChange={(event) => setUploadTitle(event.target.value)}
            placeholder="Friendly name for this image"
          />

          <label className="block">
            <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
              Image file
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
              className="block w-full font-body text-sm text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-peach/15 file:px-4 file:py-2 file:font-semibold file:text-peach-dark"
            />
          </label>
        </div>

        <AuthButton type="submit" disabled={uploading || !uploadFile}>
          {uploading ? "Uploading..." : "Upload"}
        </AuthButton>
      </form>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateQuery({ search: searchInput.trim(), page: 1 });
        }}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto]"
      >
        <AuthInput
          label="Search uploads"
          id="upload-search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by title, filename, or URL..."
        />
        <div className="flex items-end">
          <AuthButton type="submit">Search</AuthButton>
        </div>
      </form>

      {error ? (
        <div className="mb-4">
          <AuthError message={error} />
        </div>
      ) : null}
      {success ? (
        <div className="mb-4">
          <AuthSuccess message={success} />
        </div>
      ) : null}

      {loading ? (
        <p className="font-body text-charcoal/70">Loading uploads...</p>
      ) : uploads.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uploads.map((upload) => (
            <article
              key={upload.id}
              className="overflow-hidden rounded-2xl border border-peach/20 bg-white shadow-sm"
            >
              <div className="aspect-square bg-peach/5">
                <img src={upload.url} alt={upload.title} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3 p-4">
                {editingId === upload.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <AuthInput
                      label="Title"
                      id={`edit-title-${upload.id}`}
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                    <label className="block">
                      <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
                        Replace image (optional)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(event) => setEditFile(event.target.files?.[0] || null)}
                        className="block w-full font-body text-sm text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-peach/15 file:px-4 file:py-2 file:font-semibold file:text-peach-dark"
                      />
                    </label>
                    <div className="flex gap-2">
                      <AuthButton type="submit" disabled={savingEdit}>
                        {savingEdit ? "Saving..." : "Save"}
                      </AuthButton>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-2xl border border-peach/20 px-4 py-3 font-body text-sm font-semibold text-charcoal"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <h3 className="font-body text-sm font-bold text-charcoal">{upload.title}</h3>
                      <p className="mt-1 font-body text-xs text-charcoal/50">
                        {upload.originalFilename} · {formatBytes(upload.size)}
                      </p>
                      <p className="mt-1 font-body text-xs text-charcoal/50">
                        {formatDate(upload.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-cream px-3 py-2">
                      <p className="line-clamp-2 break-all font-body text-xs text-charcoal/70">
                        {upload.url}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(upload.url)}
                        className="rounded-full bg-mint/10 px-3 py-1.5 font-body text-xs font-semibold text-mint-dark"
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(upload)}
                        className="rounded-full bg-peach/10 px-3 py-1.5 font-body text-xs font-semibold text-peach-dark"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(upload.id, upload.title)}
                        className="rounded-full bg-red-50 px-3 py-1.5 font-body text-xs font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-peach/20 bg-white px-6 py-12 text-center">
          <p className="font-body text-charcoal/70">No uploads yet.</p>
        </div>
      )}

      <AdminPagination
        pagination={pagination}
        onPageChange={(nextPage) => updateQuery({ search, page: nextPage })}
      />
    </AdminShell>
  );
}
