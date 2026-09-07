"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { useAdminUser } from "@/hooks/useAdminUser";
import { categoriesApi, keysApi } from "@/lib/taxonomy/client-api";

const taxonomyApiByType = {
  keys: keysApi,
  categories: categoriesApi,
};

export default function TaxonomyManagerPage({ config }) {
  const api = taxonomyApiByType[config.type];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, loading: authLoading } = useAdminUser();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const loadItems = useCallback(async () => {
    if (!api || !email) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.listAdmin(email, { page, search });
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, email, page, search]);

  useEffect(() => {
    if (authLoading) return;
    loadItems();
  }, [authLoading, loadItems]);

  function updateQuery(next) {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.page && next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    router.push(`${config.route}${query ? `?${query}` : ""}`);
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.create(email, { name: newName.trim() });
      setNewName("");
      setSuccess(`${config.singular} added.`);
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id) {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.update(email, id, { name: editingName.trim() });
      setEditingId("");
      setEditingName("");
      setSuccess(`${config.singular} updated.`);
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(email, id);
      setSuccess(`${config.singular} deleted.`);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminShell title={config.title} description={config.description}>
      <form
        onSubmit={handleCreate}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto]"
      >
        <AuthInput
          label={`Add ${config.singular.toLowerCase()}`}
          id="newName"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={`Enter ${config.singular.toLowerCase()} name`}
          required
        />
        <div className="flex items-end">
          <AuthButton type="submit" disabled={saving}>
            Add {config.singular.toLowerCase()}
          </AuthButton>
        </div>
      </form>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateQuery({ search: searchInput.trim(), page: 1 });
        }}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto]"
      >
        <AuthInput
          label="Search"
          id="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}...`}
        />
        <div className="flex items-end">
          <AuthButton type="submit">Apply filters</AuthButton>
        </div>
      </form>

      <AuthError message={error} />
      <AuthSuccess message={success} />

      {authLoading || loading ? (
        <p className="font-body text-charcoal/70">Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-peach/20 bg-white p-8 text-center">
          <p className="font-body text-charcoal/70">No items found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-peach/20 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === item.id ? (
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className="flex-1 rounded-2xl border-2 border-peach/20 px-4 py-2 font-body outline-none focus:border-mint"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      className="rounded-xl bg-peach px-4 py-2 font-body text-sm font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId("")}
                      className="rounded-xl border border-peach/25 px-4 py-2 font-body text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-body text-base font-semibold text-charcoal">{item.name}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingName(item.name);
                      }}
                      className="rounded-xl border border-peach/25 px-4 py-2 font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="rounded-xl border border-red-200 px-4 py-2 font-body text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="mt-6">
        <AdminPagination
          pagination={pagination}
          onPageChange={(nextPage) => updateQuery({ search, page: nextPage })}
        />
      </div>
    </AdminShell>
  );
}
