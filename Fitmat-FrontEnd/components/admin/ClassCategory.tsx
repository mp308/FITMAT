import { useEffect, useMemo, useState } from "react";

type ClassCategory = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type ClassCategoryProps = {
  userId: number;
  className?: string;
};

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
  "http://localhost:4000/api";

const API_BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;

const initialFormState = {
  name: "",
  description: "",
};

type CategoryFormState = typeof initialFormState;

export default function ClassCategory({ userId, className }: ClassCategoryProps) {
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const canAct = useMemo(() => Number.isFinite(userId) && Number(userId) > 0, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/class-categories`);
        const data = (await response.json()) as ClassCategory[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch categories.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setCategories(data as ClassCategory[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching categories.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  const handleRefresh = () => setRefreshIndex((value) => value + 1);

  const handleFormChange = (field: keyof CategoryFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setForm(initialFormState);

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canAct) {
      setError("Cannot create category without a valid admin user id.");
      return;
    }

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        adminId: Number(userId),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/class-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ClassCategory | { message?: string };

      if (!response.ok) {
        const message = "message" in data && data.message
          ? data.message
          : "Failed to create category.";
        throw new Error(message);
      }

      setSuccess("Category created successfully.");
      setCategories((prev) => [data as ClassCategory, ...prev]);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error creating category.";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  return (
    <section className={`w-full bg-white border border-slate-200 rounded-xl shadow-sm ${className ?? ""}`}>
      <header className="flex flex-col gap-2 px-6 py-5 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Class Categories</h2>
          <p className="text-sm text-slate-500">Maintain categories to help members filter schedules.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className={`px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Refresh
        </button>
      </header>

      {(error || success) && (
        <div className="px-6 pt-4">
          {error && (
            <div className="mb-3 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
              {success}
            </div>
          )}
        </div>
      )}

      {!canAct && (
        <div className="px-6 py-4 text-sm text-slate-600">
          Provide a valid admin user id to manage categories.
        </div>
      )}

      {canAct && (
        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleCreateCategory} className="grid gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="category-name">
                Category name
              </label>
              <input
                id="category-name"
                type="text"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                placeholder="Strength Training"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="category-description">
                Description
              </label>
              <textarea
                id="category-description"
                value={form.description}
                onChange={(event) => handleFormChange("description", event.target.value)}
                placeholder="Add a short description"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={creating}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={creating}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition ${
                  creating ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {creating ? "Creating..." : "Create category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-sm text-slate-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-sm text-slate-500">
                  No categories available yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-800">
                    <div className="font-semibold text-slate-800">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{category.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(category.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(category.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
