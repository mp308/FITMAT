import { useEffect, useMemo, useState } from "react";

type RoleName = string;

type TrainerUser = {
  id: number;
  email: string;
  role: RoleName;
};

type ClassCategory = {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
};

type ClassSummary = {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: TrainerUser;
  trainer: TrainerUser;
  category: ClassCategory | null;
  requiredRole: RoleName | null;
  enrollmentCount: number;
  availableSpots: number | null;
};

type ClassControlProps = {
  userId: number;
  className?: string;
};

const MEMBERSHIP_ROLES: RoleName[] = [
  "USER",
  "USER_BRONZE",
  "USER_GOLD",
  "USER_PLATINUM",
];

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
  "http://localhost:4000/api";

const API_BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;

const initialFormState = {
  title: "",
  description: "",
  trainerId: "",
  categoryId: "",
  requiredRole: "",
  startTime: "",
  endTime: "",
  capacity: "",
};

type ClassFormState = typeof initialFormState;

export default function ClassControl({ userId, className }: ClassControlProps) {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [trainers, setTrainers] = useState<TrainerUser[]>([]);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [form, setForm] = useState<ClassFormState>(initialFormState);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const canAct = useMemo(() => Number.isFinite(userId) && Number(userId) > 0, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchClasses() {
      setLoadingClasses(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/classes`);
        const data = (await response.json()) as ClassSummary[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch classes.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setClasses(data as ClassSummary[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching classes.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoadingClasses(false);
        }
      }
    }

    fetchClasses();

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  useEffect(() => {
    if (!canAct) {
      setError("Invalid admin user id provided.");
      return;
    }

    let isMounted = true;

    async function fetchTrainers() {
      setLoadingTrainers(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users?adminId=${encodeURIComponent(String(userId))}&role=TRAINER`
        );
        const data = (await response.json()) as TrainerUser[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch trainers.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setTrainers(data as TrainerUser[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching trainers.";
        setError((prev) => prev ?? message);
      } finally {
        if (isMounted) {
          setLoadingTrainers(false);
        }
      }
    }

    fetchTrainers();

    return () => {
      isMounted = false;
    };
  }, [userId, canAct]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      setLoadingCategories(true);

      try {
        const response = await fetch(`${API_BASE_URL}/class-categories`);
        const data = (await response.json()) as ClassCategory[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch class categories.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setCategories(data as ClassCategory[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching categories.";
        setError((prev) => prev ?? message);
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = () => setRefreshIndex((value) => value + 1);

  const handleFormChange = (field: keyof ClassFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleCreateClass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canAct) {
      setError("Cannot create class without a valid admin user id.");
      return;
    }

    const { title, trainerId, startTime, endTime } = form;

    if (!title || !trainerId || !startTime || !endTime) {
      setError("Title, trainer, start time, and end time are required.");
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Please provide valid start and end times.");
      return;
    }

    if (endDate <= startDate) {
      setError("End time must be after the start time.");
      return;
    }

    const trimmedCapacity = form.capacity.trim();
    if (trimmedCapacity) {
      const parsedCapacity = Number(trimmedCapacity);
      if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
        setError("Capacity must be a positive number.");
        return;
      }
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Record<string, unknown> = {
        adminId: Number(userId),
        trainerId: Number(trainerId),
        title,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };

      if (form.description) payload.description = form.description;
      if (form.categoryId) payload.categoryId = Number(form.categoryId);
      if (form.requiredRole) payload.requiredRole = form.requiredRole;
      if (trimmedCapacity) payload.capacity = Number(trimmedCapacity);

      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ClassSummary | { message?: string };

      if (!response.ok) {
        const message = "message" in data && data.message
          ? data.message
          : "Failed to create class.";
        throw new Error(message);
      }

      setSuccess("Class created successfully.");
      setClasses((prev) => [data as ClassSummary, ...prev]);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error creating class.";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return "-";
    }

    const diff = Math.max(0, endDate.getTime() - startDate.getTime());
    const totalMinutes = Math.round(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) {
      return `${minutes}m`;
    }

    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  };

  return (
    <section className={`w-full bg-white border border-slate-200 rounded-xl shadow-sm ${className ?? ""}`}>
      <header className="flex flex-col gap-2 px-6 py-5 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Class Management</h2>
          <p className="text-sm text-slate-500">Create and review classes available to members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingClasses}
            className={`px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${
              loadingClasses ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Refresh
          </button>
        </div>
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
          Provide a valid admin user id to manage classes.
        </div>
      )}

      {canAct && (
        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50/60">
          <form onSubmit={handleCreateClass} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-title">
                Class title
              </label>
              <input
                id="class-title"
                type="text"
                value={form.title}
                onChange={(event) => handleFormChange("title", event.target.value)}
                placeholder="Strength & Conditioning"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-description">
                Description
              </label>
              <textarea
                id="class-description"
                value={form.description}
                onChange={(event) => handleFormChange("description", event.target.value)}
                placeholder="Write a short overview for members"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-trainer">
                Trainer
              </label>
              <select
                id="class-trainer"
                value={form.trainerId}
                onChange={(event) => handleFormChange("trainerId", event.target.value)}
                disabled={loadingTrainers}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="">Select trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-category">
                Category
              </label>
              <select
                id="class-category"
                value={form.categoryId}
                onChange={(event) => handleFormChange("categoryId", event.target.value)}
                disabled={loadingCategories}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-required-role">
                Required membership
              </label>
              <select
                id="class-required-role"
                value={form.requiredRole}
                onChange={(event) => handleFormChange("requiredRole", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Open to all</option>
                {MEMBERSHIP_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-start">
                Start time
              </label>
              <input
                id="class-start"
                type="datetime-local"
                value={form.startTime}
                onChange={(event) => handleFormChange("startTime", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-end">
                End time
              </label>
              <input
                id="class-end"
                type="datetime-local"
                value={form.endTime}
                onChange={(event) => handleFormChange("endTime", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="class-capacity">
                Capacity
              </label>
              <input
                id="class-capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(event) => handleFormChange("capacity", event.target.value)}
                placeholder="20"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
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
                {creating ? "Creating..." : "Create class"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trainer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Membership</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loadingClasses ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-500">
                  Loading classes...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-500">
                  No classes scheduled yet.
                </td>
              </tr>
            ) : (
              classes.map((clazz) => {
                const capacityInfo = clazz.capacity === null || clazz.capacity === undefined
                  ? "Unlimited"
                  : `${clazz.enrollmentCount}/${clazz.capacity}`;
                const spotsInfo = clazz.availableSpots === null || clazz.availableSpots === undefined
                  ? ""
                  : ` • ${clazz.availableSpots} spots left`;

                return (
                  <tr key={clazz.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-800">
                      <div className="font-semibold text-slate-800">{clazz.title}</div>
                      {clazz.category && (
                        <div className="text-xs text-slate-500 mt-0.5">{clazz.category.name}</div>
                      )}
                      {clazz.description && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{clazz.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div>{formatDateTime(clazz.startTime)}</div>
                      <div className="text-xs text-slate-500">
                        Ends {formatDateTime(clazz.endTime)} ({formatDuration(clazz.startTime, clazz.endTime)})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div>{clazz.trainer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {capacityInfo}
                      <span className="text-xs text-slate-500">{spotsInfo}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {clazz.requiredRole ?? "Open"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDateTime(clazz.updatedAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
