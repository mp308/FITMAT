import React, { useEffect, useMemo, useState } from "react";
import UserControl from "../../components/admin/UserControl";
import ClassControl from "../../components/admin/ClassControl";
import ClassCategory from "../../components/admin/ClassCategory";
import ContactControl from "../../components/admin/ContactControl";
import ReviewControl from "../../components/admin/ReviewContol";
import TrainerControl from "../../components/admin/TrainerControl";
import PaymentControl from "../../components/admin/PaymentControl";

type TokenPayload = {
  id?: number;
  role?: string;
  exp?: number;
  email?: string;
};

function parseJwt(token: string): TokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (_error) {
    return null;
  }
}

export default function CustomerManagementSystem() {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checkedToken, setCheckedToken] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setCheckedToken(true);
      return;
    }

    setToken(storedToken);

    const payload = parseJwt(storedToken);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      setUser(payload);
    }

    setCheckedToken(true);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const adminId = useMemo(() => {
    if (!isAdmin || typeof user?.id !== "number") {
      return Number.NaN;
    }
    return user.id;
  }, [isAdmin, user?.id]);

  const renderStatus = () => {
    if (!checkedToken) {
      return (
        <p className="text-sm text-slate-500">Checking your session…</p>
      );
    }

    if (!token) {
      return (
        <p className="text-sm text-slate-600">
          Please sign in to access the customer management system.
        </p>
      );
    }

    if (!isAdmin) {
      return (
        <p className="text-sm text-red-600">
          You need administrator access to view this dashboard.
        </p>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6">
        <header className="rounded-2xl bg-white px-8 py-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Customer Management System</h1>
          <p className="mt-1 text-sm text-slate-600">
            Centralized controls for users, classes, trainers, reviews, contact requests, and payments.
          </p>
          {renderStatus()}
        </header>

        {isAdmin && (
          <div className="flex flex-col gap-10">
            <UserControl userId={adminId} />

            <div className="grid gap-10 lg:grid-cols-12">
              <ClassControl userId={adminId} className="lg:col-span-8" />
              <ClassCategory userId={adminId} className="lg:col-span-4" />
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              <ReviewControl userId={adminId} className="lg:col-span-7" />
              <TrainerControl userId={adminId} className="lg:col-span-5" />
            </div>

            <div className="grid gap-10">
              <ContactControl userId={adminId} className="lg:col-span-6" />
              <PaymentControl userId={adminId} className="lg:col-span-6" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
