"use client";

import React, { useEffect, useState } from "react";

type TokenPayload = {
  id?: number;
  role?: string;
  exp?: number; // seconds since epoch
  email?: string;
};

export default function PaymentUpload() {
  const [form, setForm] = useState({
    amount: "",
    note: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
    } catch {
      return null;
    }
  }

  useEffect(() => {
    // ทำงานฝั่ง client เท่านั้น
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const payload = parseJwt(storedToken);
    const notExpired = payload?.exp ? payload.exp * 1000 > Date.now() : true;

    if (payload && notExpired) {
      setUser(payload);
      setToken(storedToken);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setStatus("กรุณาเข้าสู่ระบบก่อนอัปโหลดหลักฐานการชำระเงิน");
      return;
    }
    if (!file) {
      setStatus("กรุณาเลือกไฟล์สลิปการชำระเงิน");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      // ส่ง userId จาก token โดยตรง
      formData.append("userId", String(user.id));
      formData.append("amount", form.amount);
      formData.append("note", form.note);
      formData.append("paymentImage", file);

      const res = await fetch("http://localhost:4000/api/payments", {
        method: "POST",
        body: formData,
        // ถ้า API ฝั่งหลังบ้านต้องใช้ Bearer token ให้ปลดคอมเมนต์ headers ด้านล่าง
        // headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        // พยายามอ่านข้อความ error ที่ฝั่ง API ส่งมา
        let message = "Upload failed";
        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      setStatus("success");
      setForm({ amount: "", note: "" });
      setFile(null);
    } catch (err: any) {
      setStatus(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-lg mx-auto bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          อัปโหลดหลักฐานการชำระเงิน
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">จำนวนเงิน</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">หมายเหตุ</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">อัปโหลดสลิป</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 active:scale-95 transition"
          >
            {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-green-600 text-center">
            ✅ อัปโหลดหลักฐานการชำระเงินเรียบร้อยแล้ว!
          </p>
        )}
        {status && status !== "success" && (
          <p className="mt-4 text-red-600 text-center">❌ {status}</p>
        )}
      </div>
    </section>
  );
}
