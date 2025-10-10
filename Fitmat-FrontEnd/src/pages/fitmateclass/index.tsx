"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";

type Class = {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  requiredRole: string | null;
  availableSpots: number | null;
  enrollmentCount: number;
  trainer: { id: number; email: string; role: string } | null;
  category: { id: number; name: string | null } | null;
};

export default function ClassListPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/classes/listclassupcoming");
        if (!res.ok) throw new Error("โหลดข้อมูลคลาสไม่สำเร็จ");
        const data = await res.json();
        setClasses(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="bg-gray-300">
      <main className="max-w-6xl mx-auto py-12 px-4 ">
        <div className="pb-9">
          <Header />
        </div>
        <h1 className="text-3xl font-bold text-red-600 text-center mb-10">
          ตารางคลาสทั้งหมด
        </h1>

        {loading && (
          <p className="text-center text-gray-500">⏳ กำลังโหลด...</p>
        )}
        {error && <p className="text-center text-red-500">❌ {error}</p>}
        {!loading && !error && classes.length === 0 && (
          <p className="text-center text-gray-500">ยังไม่มีคลาส</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((clazz) => (
            <div
              key={clazz.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="bg-red-500 text-white px-4 py-2 font-bold text-sm">
                {clazz.category?.name || "ไม่ระบุหมวดหมู่"}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {clazz.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  {clazz.description || "ไม่มีคำอธิบาย"}
                </p>

                <div className="text-sm text-gray-500 mb-2">
                  🕒 {new Date(clazz.startTime).toLocaleString()} -{" "}
                  {new Date(clazz.endTime).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  👨‍🏫 {clazz.trainer?.email || "ยังไม่มีเทรนเนอร์"}
                </div>

                <div className="mt-auto">
                  {clazz.availableSpots !== null ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        clazz.availableSpots > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      ที่ว่าง {clazz.availableSpots}/{clazz.capacity}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">ไม่จำกัดจำนวน</span>
                  )}
                </div>
              </div>
              <button
                className="bg-blue-600 text-white py-2 text-center font-semibold hover:bg-blue-700 transition"
                onClick={() => router.push(`/fitmateclass/${clazz.id}`)}
              >
                ดูรายละเอียด
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
