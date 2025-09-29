import React, { useEffect, useState } from "react";
import Header from "../../../components/Layout/Header";
import Link from "next/link";
import Footer from "../../../components/Layout/Footer";

type Trainer = {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalReviews: number;
  averageRating: number | null;
};

export default function Trainer() {
  const [open, setOpen] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/trainers");
        if (!res.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await res.json();
        setTrainers(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <main className="w-full text-gray-800 bg-gray-100">
      {/* ===== Header ===== */}
      <Header />

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <img
            src="/images/hero-trainer.jpg"
            alt="Personal training"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <h1 className="text-white font-extrabold leading-tight text-2xl sm:text-4xl md:text-5xl mb-4">
              พบกับเทรนเนอร์ของเรา
            </h1>
          </div>
        </div>
      </section>
      {/* ===== จุดเด่นของทีมเทรนเนอร์ ===== */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="w-full">
              <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-bold text-base mb-4 shadow-lg shadow-red-200/60">
                จุดเด่นของทีมเทรนเนอร์
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2 leading-snug drop-shadow">
                เทรนเนอร์มืออาชีพของเรา
                <br />
                พร้อมช่วยคุณบรรลุเป้าหมายด้านสุขภาพและฟิตเนส
                <br />
                ด้วยประสบการณ์และความเข้าใจในแต่ละเป้าหมายของลูกค้าอย่างแท้จริง
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img
                  src="/images/icon1.png"
                  alt="icon1"
                  className="w-12 h-12"
                />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">
                พร้อมให้คำปรึกษาฟรีก่อนเริ่มทุกคอร์ส
              </div>
              <div className="text-gray-500 text-sm">
                สอบถามได้ทุกเรื่องสุขภาพ
              </div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img
                  src="/images/icon2.png"
                  alt="icon2"
                  className="w-12 h-12"
                />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">
                เชี่ยวชาญกับงานเทรนนิ่งและการดีไซน์
              </div>
              <div className="text-gray-500 text-sm">
                ออกแบบโปรแกรมเฉพาะบุคคล
              </div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img
                  src="/images/icon3.png"
                  alt="icon3"
                  className="w-12 h-12"
                />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">
                เทรนเนอร์ได้รับการรับรองจากสถาบันชั้นนำ
              </div>
              <div className="text-gray-500 text-sm">มั่นใจในมาตรฐาน</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img
                  src="/images/icon4.png"
                  alt="icon4"
                  className="w-12 h-12"
                />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">
                รีวิวจากลูกค้ากว่า 500+ คน
              </div>
              <div className="text-gray-500 text-sm">
                ความประทับใจจริงจากผู้ใช้บริการ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ค้นหาเทรนเนอร์ที่คุณต้องการ ===== */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <a
            href="#trainer-list"
            className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-200 mb-6"
          >
            ค้นหาเทรนเนอร์ที่คุณต้องการ
          </a>
        </div>
      </section>

      {/* ===== ความเชี่ยวชาญของเรา ===== */}
      <section className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <img
              src="/images/trainer-session.jpg"
              alt="Personal training session"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="flex-1">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold mb-4">
              ความเชี่ยวชาญของเรา
            </div>
            <div className="text-gray-800 font-bold mb-2">
              เรามุ่งมั่นที่จะช่วยให้คุณไปถึงเป้าหมายสุขภาพด้วยโปรแกรมการฝึกที่ออกแบบเฉพาะบุคคล
              พร้อมให้คำแนะนำเรื่องการออกกำลังกาย และโภชนาการ
            </div>
          </div>
        </div>
      </section>

      {/* ===== ทีมเทรนเนอร์ของเรา ===== */}
      <section id="trainer-list" className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-8">
            ทีมเทรนเนอร์ของเรา
          </h2>

          {loading && <p className="text-center text-gray-500">กำลังโหลด...</p>}
          {error && <p className="text-center text-red-500">❌ {error}</p>}
          {!loading && !error && trainers.length === 0 && (
            <p className="text-center text-gray-500">ยังไม่มีเทรนเนอร์</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="bg-gray-100 rounded-2xl shadow p-4 flex flex-col items-center"
              >
                <img
                  src={`/images/trainer${t.id}.jpg`}
                  alt={`เทรนเนอร์ ${t.email}`}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/default-trainer.jpg";
                  }}
                />
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  {new Date(t.createdAt).getFullYear()}
                </div>
                <div className="font-bold text-lg mb-1">{t.email}</div>
                <div className="text-gray-600 text-sm mb-2">{t.role}</div>

                {/* stars */}
                <div
                  className="flex gap-1 text-yellow-400 justify-center"
                  aria-label={`${t.averageRating || 0} stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      className={`w-5 h-5 ${
                        t.averageRating && i < Math.round(t.averageRating)
                          ? "fill-current"
                          : "fill-gray-300"
                      }`}
                    >
                      <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                    </svg>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {t.totalReviews} reviews
                </div>

                <Link
                  href={`/trainer/${t.id}`}
                  className="mt-1 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 active:bg-red-700 active:scale-95 transition"
                >
                  ดูรายละเอียด
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== Footer ===== */}
      <Footer />
    </main>
  );
}
