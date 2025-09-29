"use client";

import React, { useState } from "react";

export default function PaymentUpload() {
  const [form, setForm] = useState({
    userId: "",
    amount: "",
    note: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("กรุณาเลือกไฟล์สลิปการชำระเงิน");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("userId", form.userId);
      formData.append("amount", form.amount);
      formData.append("note", form.note);
      formData.append("paymentImage", file); 

      const res = await fetch("http://localhost:4000/api/payments", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }

      setStatus("success");
      setForm({ userId: "", amount: "", note: "" });
      setFile(null);
    } catch (err: any) {
      setStatus(err.message || "Something went wrong");
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
            <label className="block mb-2 text-sm font-medium">User ID</label>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
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
            ></textarea>
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
