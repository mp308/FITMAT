import { useEffect, useMemo, useState } from "react";

type RoleName = string;

type ManagedUser = {
  id: number;
  email: string;
  role: RoleName;
  createdAt: string;
  updatedAt: string;
};

type UpdateUserResponse = {
  id: number;
  email: string;
  role: RoleName;
  updatedAt: string;
};

type UserControlProps = {
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

export default function UserControl({ userId, className }: UserControlProps) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<RoleName[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [draftRoles, setDraftRoles] = useState<Record<number, RoleName>>({});
  const [refreshIndex, setRefreshIndex] = useState(0);

  const canFetch = useMemo(() => Number.isFinite(userId), [userId]);

  useEffect(() => {
    if (!canFetch) {
      setError("Invalid admin ID provided.");
      return;
    }

    let isMounted = true;

    async function fetchUsers() {
      setLoadingUsers(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users?adminId=${encodeURIComponent(String(userId))}`
        );

        const data = (await response.json()) as ManagedUser[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch users.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setUsers(data as ManagedUser[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching users.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [userId, refreshIndex, canFetch]);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoles() {
      setLoadingRoles(true);

      try {
        const response = await fetch(`${API_BASE_URL}/users/roles`);
        const data = (await response.json()) as RoleName[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch roles.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setRoles(data as RoleName[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching roles.";
        setError((prev) => prev ?? message);
      } finally {
        if (isMounted) {
          setLoadingRoles(false);
        }
      }
    }

    fetchRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangeRole = (id: number, nextRole: RoleName) => {
    setDraftRoles((prev) => ({
      ...prev,
      [id]: nextRole,
    }));
  };

  const handleRefresh = () => setRefreshIndex((value) => value + 1);

  async function handleUpdateRole(targetUserId: number) {
    const pendingRole = draftRoles[targetUserId];
    const currentUser = users.find((user) => user.id === targetUserId);

    if (!currentUser) {
      setError("User not found in current list.");
      return;
    }

    const nextRole = pendingRole ?? currentUser.role;

    setUpdatingUserId(targetUserId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: userId,
          role: nextRole,
        }),
      });

      const data = (await response.json()) as UpdateUserResponse | { message?: string };

      if (!response.ok) {
        const message = "message" in data && data.message
          ? data.message
          : "Failed to update user role.";
        throw new Error(message);
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === targetUserId
            ? {
                ...user,
                role: (data as UpdateUserResponse).role,
                updatedAt: (data as UpdateUserResponse).updatedAt,
              }
            : user
        )
      );

      setDraftRoles(({ [targetUserId]: _discard, ...rest }) => rest);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error updating role.";
      setError(message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  return (
    <section className={`w-full bg-white border border-slate-200 rounded-xl shadow-sm ${className ?? ""}`}>
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage user roles and access permissions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingUsers}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${
              loadingUsers ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-4 mb-2 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {!canFetch && (
        <div className="px-6 py-4 text-sm text-slate-600">
          Provide a valid admin user ID to load user data.
        </div>
      )}

      {canFetch && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-sm text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-5 text-center text-sm text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const selectedRole = draftRoles[user.id] ?? user.role;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <select
                          value={selectedRole}
                          onChange={(event) => handleChangeRole(user.id, event.target.value)}
                          disabled={updatingUserId === user.id || loadingRoles}
                          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          {(roles.length > 0 ? roles : [user.role]).map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(user.updatedAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(user.id)}
                          disabled={updatingUserId === user.id || loadingRoles}
                          className={`w-full max-w-[120px] px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition ${
                            updatingUserId === user.id || loadingRoles ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          {updatingUserId === user.id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
