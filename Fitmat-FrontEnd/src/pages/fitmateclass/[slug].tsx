"use client";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router"; // ✅ ใช้จาก next/router สำหรับ Pages Router
import { Header } from "../../../components";

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

type TokenPayload = {
  id?: number;
  role?: string;
  exp?: number;
  email?: string;
};

export default function ClassDetailPage() {
  const router = useRouter();
  const { slug } = router.query; // ✅ ได้ค่าจาก URL /fitmateclass/[slug]
  const [user, setUser] = useState<TokenPayload | null>(null);

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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const payload = parseJwt(storedToken);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      setUser(payload);
    }
  }, []);

  // แปลง slug -> classId แบบปลอดภัย
  const classId = useMemo<number | null>(() => {
    if (!slug) return null;
    const s = Array.isArray(slug) ? slug[0] : slug;
    const n = Number(s);
    return Number.isNaN(n) ? null : n;
  }, [slug]);

  const [clazz, setClazz] = useState<ClassDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูล class + ผู้สมัคร
  useEffect(() => {
    if (classId == null) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/classes/${classId}/enrollments`
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
  }, [classId]);

  // เช็กสถานะเริ่ม-จบ
  const status = useMemo<"UPCOMING" | "ONGOING" | "ENDED" | null>(() => {
    if (!clazz) return null;
    const now = new Date();
    const start = new Date(clazz.startTime);
    const end = new Date(clazz.endTime);
    if (start > now) return "UPCOMING";
    if (end < now) return "ENDED";
    return "ONGOING";
  }, [clazz]);

  // สมัครคลาส (mock userId = 1) —> ควรเปลี่ยนเป็น user id จริงจาก auth ของคุณ
  const handleEnroll = async () => {
    if (classId == null) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/classes/${classId}/enroll`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // ✅ ต้องส่ง classId ไปด้วย ไม่งั้น backend ไม่รู้จะลงทะเบียนคลาสไหน
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        await Swal.fire({
          icon: "error",
          title: "สมัครไม่สำเร็จ",
          text: err?.message || "ไม่สามารถสมัครคลาสได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "สมัครสำเร็จ",
        text: "สมัครคลาสสำเร็จแล้ว",
        confirmButtonColor: "#ef4444",
      });

      // ✅ โหลดรายชื่อผู้สมัครของคลาสนี้ใหม่ (เดิมคุณยิงที่ endpoint รวม โดยไม่ส่ง classId)
      const updated = await fetch(
        `http://localhost:4000/api/classes/${classId}/enrollments`
      );
      const data = await updated.json();
      setEnrollments(data.enrollments);
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสมัครคลาสได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (loading) return <p className="text-center py-12">⏳ กำลังโหลด...</p>;
  if (error)
    return <p className="text-center text-red-500 py-12">❌ {error}</p>;
  if (!clazz) return null;

  return (
    <div className="bg-gray-300">
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        {/* Header */}
        <div className="pb-9">
          <Header />
        </div>

        <div className="bg-red-500 text-white rounded-t-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{clazz.title}</h1>
              <p className="text-sm">
                {clazz.category?.name || "ไม่ระบุหมวดหมู่"}
              </p>
            </div>
            {status && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  status === "UPCOMING"
                    ? "bg-yellow-400 text-black"
                    : status === "ONGOING"
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {status === "UPCOMING"
                  ? "ยังไม่เริ่ม"
                  : status === "ONGOING"
                  ? "กำลังเรียน"
                  : "จบแล้ว"}
              </span>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white shadow-lg rounded-b-xl p-6 space-y-4">
          <p className="text-gray-700">
            {clazz.description || "ไม่มีคำอธิบาย"}
          </p>

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
              disabled={status === "ENDED"}
              className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
                status === "ENDED"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              title={status === "ENDED" ? "คลาสนี้จบแล้ว" : "สมัครเข้าคลาส"}
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
    </div>
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
