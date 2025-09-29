import { useEffect, useMemo, useState } from "react";

type RoleName = string;

type PaymentUser = {
  id: number | null;
  email: string | null;
  role: RoleName | null;
};

type PaymentRecord = {
  id: number;
  userId: number | null;
  amount: number | null;
  note: string | null;
  filename: string | null;
  mimeType: string | null;
  createdAt: string;
  user: PaymentUser | null;
};

type UserSummary = {
  id: number;
  email: string;
  role: RoleName;
};

type PaymentControlProps = {
  userId: number;
  className?: string;
};

type ImagePreview = {
  id: number;
  src: string;
  filename: string | null;
};

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
  "http://localhost:4000/api";

const API_BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;

export default function PaymentControl({ userId, className }: PaymentControlProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [filterUserId, setFilterUserId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const canAct = useMemo(() => Number.isFinite(userId) && Number(userId) > 0, [userId]);

  useEffect(() => {
    if (!canAct) {
      setUsersError("Invalid admin user id provided.");
      return;
    }

    setUsersError(null);

    let isMounted = true;

    async function fetchUsers() {
      setLoadingUsers(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users?adminId=${encodeURIComponent(String(userId))}`
        );
        const data = (await response.json()) as UserSummary[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch users.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setUsers(data as UserSummary[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching users.";
        setUsersError(message);
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
  }, [userId, canAct]);

  useEffect(() => {
    if (!canAct) {
      setPaymentsError("Invalid admin user id provided.");
      return;
    }

    setPaymentsError(null);

    let isMounted = true;

    async function fetchPayments() {
      setLoadingPayments(true);

      const params = new URLSearchParams({ adminId: String(userId) });
      if (filterUserId) {
        params.append("userId", filterUserId);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/payments?${params.toString()}`);
        const data = (await response.json()) as PaymentRecord[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch payment proofs.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setPayments(data as PaymentRecord[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching payments.";
        setPaymentsError(message);
      } finally {
        if (isMounted) {
          setLoadingPayments(false);
        }
      }
    }

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [filterUserId, userId, canAct, refreshIndex]);

  const handleRefresh = () => {
    setRefreshIndex((value) => value + 1);
  };

  const handlePreviewImage = async (paymentId: number, filename: string | null) => {
    if (!canAct) {
      setImageError("Invalid admin session.");
      return;
    }

    setImageLoading(true);
    setImageError(null);

    const params = new URLSearchParams({ adminId: String(userId) });

    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/image?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message ?? "Failed to fetch payment proof image.";
        throw new Error(message);
      }

      const blob = await response.blob();
      const src = URL.createObjectURL(blob);
      setImagePreview({ id: paymentId, src, filename });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error loading image.";
      setImageError(message);
    } finally {
      setImageLoading(false);
    }
  };

  const clearPreview = () => {
    if (imagePreview?.src) {
      URL.revokeObjectURL(imagePreview.src);
    }
    setImagePreview(null);
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  const formatAmount = (value: number | null) => {
    if (value === null || Number.isNaN(value)) {
      return "-";
    }
    return value.toLocaleString(undefined, { style: "currency", currency: "THB" });
  };

  return (
    <section className={`w-full bg-white border border-slate-200 rounded-xl shadow-sm ${className ?? ""}`}>
      <header className="flex flex-col gap-2 px-6 py-5 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Payment Proofs</h2>
          <p className="text-sm text-slate-500">Review submissions and verify payment confirmations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterUserId}
            onChange={(event) => setFilterUserId(event.target.value)}
            disabled={loadingUsers || users.length === 0}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingPayments}
            className={`px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${
              loadingPayments ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Refresh
          </button>
        </div>
      </header>

      {(paymentsError || usersError || imageError) && (
        <div className="px-6 pt-4 space-y-2">
          {paymentsError && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">{paymentsError}</div>
          )}
          {usersError && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">{usersError}</div>
          )}
          {imageError && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">{imageError}</div>
          )}
        </div>
      )}

      {!canAct && (
        <div className="px-6 py-4 text-sm text-slate-600">
          Provide a valid admin user id to review payment submissions.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loadingPayments ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-slate-500">
                  Loading payment proofs...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-slate-500">
                  No payment proofs submitted yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-800">
                    <div className="font-semibold text-slate-800">
                      {payment.user?.email ?? `User #${payment.userId ?? "unknown"}`}
                    </div>
                    {payment.userId && (
                      <div className="text-xs text-slate-500">ID: {payment.userId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{formatAmount(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {payment.note ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(payment.createdAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      type="button"
                      onClick={() => handlePreviewImage(payment.id, payment.filename)}
                      disabled={imageLoading}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition ${
                        imageLoading ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      View proof
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Payment Proof</h3>
                <p className="text-xs text-slate-500">
                  {imagePreview.filename ?? `Proof #${imagePreview.id}`}
                </p>
              </div>
              <button
                type="button"
                onClick={clearPreview}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto bg-slate-100 flex items-center justify-center">
              <img
                src={imagePreview.src}
                alt={imagePreview.filename ?? "Payment proof"}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
