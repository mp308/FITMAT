"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  role: string;
};

type Enrollment = {
  id: number;
  createdAt: string;
  user: User;
};

type ClassDetail = {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  capacity: number | null;
  createdBy: User | null;
  trainer: User | null;
  category: { id: number; name: string | null } | null;
  requiredRole: string | null;
  availableSpots?: number | null;
};

export default function ClassDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [clazz, setClazz] = useState<ClassDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูล class + ผู้สมัคร
  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/classes/${slug}/enrollments`
        );
        if (!res.ok) throw new Error("ไม่พบข้อมูลคลาส");
        const data = await res.json();
        setClazz(data.class);
        setEnrollments(data.enrollments);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // สมัครคลาส (mock userId = 1)
  const handleEnroll = async () => {
    if (!slug) return;
    try {
      const res = await fetch(
        `http://localhost:4000/api/classes/${slug}/enroll`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: 1 }), // สมมติ user id = 1
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert(`❌ สมัครไม่สำเร็จ: ${err.message}`);
        return;
      }
      alert("✅ สมัครคลาสสำเร็จ");
      // โหลดรายชื่อใหม่
      const updated = await fetch(
        `http://localhost:4000/api/classes/${slug}/enrollments`
      );
      const data = await updated.json();
      setEnrollments(data.enrollments);
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

  if (loading) return <p className="text-center py-12">⏳ กำลังโหลด...</p>;
  if (error)
    return <p className="text-center text-red-500 py-12">❌ {error}</p>;
  if (!clazz) return null;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="bg-red-500 text-white rounded-t-xl px-6 py-4">
        <h1 className="text-2xl font-bold">{clazz.title}</h1>
        <p className="text-sm">{clazz.category?.name || "ไม่ระบุหมวดหมู่"}</p>
      </div>

      {/* Detail */}
      <div className="bg-white shadow-lg rounded-b-xl p-6 space-y-4">
        <p className="text-gray-700">{clazz.description || "ไม่มีคำอธิบาย"}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info
            label="เริ่ม"
            value={new Date(clazz.startTime).toLocaleString()}
          />
          <Info
            label="สิ้นสุด"
            value={new Date(clazz.endTime).toLocaleString()}
          />
          <Info label="Trainer" value={clazz.trainer?.email ?? "-"} />
          <Info label="ที่นั่ง" value={clazz.capacity ?? "ไม่จำกัด"} />
        </div>

        {/* ปุ่มสมัคร */}
        <div className="pt-4 flex gap-3">
          <button
            onClick={handleEnroll}
            className={`px-5 py-2 rounded-lg font-semibold text-white transition
            bg-blue-600 hover:bg-blue-700"
            }`}
          >
            สมัครเข้าคลาส
          </button>
          <button
            onClick={() => router.push("/fitmateclass")}
            className="px-5 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition"
          >
            ย้อนกลับ
          </button>
        </div>

        {/* ตารางผู้สมัคร */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-3">📋 รายชื่อผู้สมัคร</h2>
          {enrollments.length > 0 ? (
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">อีเมล</th>
                  <th className="p-2 border">บทบาท</th>
                  <th className="p-2 border">สมัครเมื่อ</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enroll, idx) => (
                  <tr key={enroll.id} className="text-center">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">{enroll.user.email}</td>
                    <td className="p-2 border">{enroll.user.role}</td>
                    <td className="p-2 border">
                      {new Date(enroll.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">ยังไม่มีผู้สมัคร</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
