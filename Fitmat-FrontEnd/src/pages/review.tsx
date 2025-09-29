import React, { useEffect, useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

type ReviewSummary = {
  totalReviews: number;
  averageRating: number;
  ratingCounts: Record<string, number>;
};

export default function Review() {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/reviews/summary");
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <main className="w-full text-gray-800">
      {/* ===== Header ===== */}
      <Header />

      {/* ===== Hero Section ===== */}
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
              Review
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
            {loading && <p className="text-gray-500">⏳ กำลังโหลด...</p>}
            {error && <p className="text-red-500">❌ {error}</p>}
            {summary && (
              <>
                {/* ค่าเฉลี่ย */}
                <div className="flex items-center gap-4">
                  <span className="text-red-500 text-5xl font-extrabold">
                    {summary.averageRating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex gap-1 text-yellow-400 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          viewBox="0 0 20 20"
                          className={`w-6 h-6 ${
                            i < Math.round(summary.averageRating)
                              ? "fill-current"
                              : "text-gray-300 fill-current"
                          }`}
                        >
                          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-800 font-bold text-lg">
                      คะแนนเฉลี่ยจาก {summary.totalReviews} รีวิว
                    </span>
                  </div>
                </div>

                {/* breakdown */}
                <div className="space-y-2">
                  {Object.entries(summary.ratingCounts)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([star, count]) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-12 text-sm text-gray-700 font-semibold">
                          {star} ดาว
                        </span>
                        <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-yellow-400 h-3"
                            style={{
                              width: `${(count / summary.totalReviews) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-sm text-gray-500">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Why Us */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold mb-4">
                สิ่งที่ทำให้เราแตกต่าง
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                เราช่วยให้คุณบรรลุเป้าหมายสุขภาพได้อย่างมีประสิทธิภาพ
              </h2>
              <p className="text-gray-700 mb-4">
                ด้วยทีมงานเทรนเนอร์คุณภาพ ที่ผ่านคัดเลือกและมีประสบการณ์จริง
                พร้อมดูแลและให้คำแนะนำอย่างใกล้ชิด
              </p>
              <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 active:bg-red-700 transition-all duration-200">
                เพราะคุณภาพคือหัวใจของเรา
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section className="py-16 bg-white relative">
        {/* ตกแต่งพื้นหลัง */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 w-16 h-16 bg-red-100 rounded-lg rotate-12 opacity-60"></div>
          <div className="absolute top-0 right-16 w-16 h-16 bg-red-100 rounded-lg -rotate-6 opacity-60"></div>
          <div className="absolute bottom-8 left-1/2 w-16 h-16 bg-red-100 rounded-lg -rotate-12 opacity-60"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">
            บริการของเรา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img
                src="/images/service1.jpg"
                alt="วางแผนการออกกำลังกาย"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold text-lg mb-2">วางแผนการออกกำลังกาย</h3>
              <p className="text-gray-600 mb-4">
                ออกแบบโปรแกรมเฉพาะบุคคล
                โดยเทรนเนอร์มืออาชีพตามเป้าหมายที่คุณต้องการ
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img
                src="/images/service2.jpg"
                alt="วิเคราะห์พฤติกรรมและไลฟ์สไตล์"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold text-lg mb-2">
                วิเคราะห์พฤติกรรมและไลฟ์สไตล์
              </h3>
              <p className="text-gray-600 mb-4">
                ทีมงานมืออาชีพช่วยวิเคราะห์และให้คำแนะนำเพื่อผลลัพธ์ที่ดีที่สุด
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img
                src="/images/service3.jpg"
                alt="ติดตามผลอย่างใกล้ชิด"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold text-lg mb-2">ติดตามผลอย่างใกล้ชิด</h3>
              <p className="text-gray-600 mb-4">
                เทรนเนอร์คอยติดตามและปรับแผนอย่างต่อเนื่อง
                พร้อมรายงานผลลัพธ์ให้คุณทราบ
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
     <Footer/>
    </main>
  );
}
