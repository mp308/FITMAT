import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const StarRow = () => (
  <div
    className="flex gap-1 text-yellow-400 justify-center"
    aria-label="5 stars"
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
      </svg>
    ))}
  </div>
);

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const router = useRouter();

  const reviews = [
    {
      img: "/images/review1.jpg",
      name: "ลูกค้าคนที่ 1",
      text: "เทรนเนอร์ใส่ใจมากโปรแกรมออกกำลังกายเหมาะกับเรา ทำตามแล้วเห็นผลจริง!",
    },
    {
      img: "/images/review2.jpg",
      name: "ลูกค้าคนที่ 2",
      text: "จองคิวง่าย สะดวก เทรนเนอร์ให้คำแนะนำดีมาก ประทับใจสุดๆ",
    },
    {
      img: "/images/review3.jpg",
      name: "ลูกค้าคนที่ 3",
      text: "ได้เทรนเนอร์ที่เข้าใจเป้าหมายของเรา ทำให้มีกำลังใจออกกำลังกายต่อเนื่อง",
    },
    {
      img: "/images/review4.jpg",
      name: "ลูกค้าคนที่ 4",
      text: "บริการดีมาก เทรนเนอร์เป็นมืออาชีพและเป็นกันเอง แนะนำเลยครับ",
    },
    {
      img: "/images/review5.jpg",
      name: "ลูกค้าคนที่ 5",
      text: "หลังใช้บริการ รู้สึกสุขภาพดีขึ้น น้ำหนักลดลงตามเป้าหมาย ขอบคุณมากครับ",
    },
    {
      img: "/images/review6.jpg",
      name: "ลูกค้าคนที่ 6",
      text: "เหมาะกับคนที่ไม่มีเวลาไปฟิตเนส เทรนออนไลน์ก็สนุกและได้ผลจริง",
    },
  ];

  const showReviews = [
    reviews[reviewIndex % reviews.length],
    reviews[(reviewIndex + 1) % reviews.length],
    reviews[(reviewIndex + 2) % reviews.length],
  ];

  const handlePrev = () => {
    setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <main className="w-full text-gray-800">
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

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
            <div className="h-full flex flex-col justify-center">
              <h1 className="max-w-3xl text-white font-extrabold leading-tight text-3xl sm:text-5xl">
                "เริ่มต้นสุขภาพดีวันนี้กับ
                <br className="hidden sm:block" />
                เทรนเนอร์มืออาชีพ"
              </h1>
              <p className="mt-5 text-white/90 text-base sm:text-xl max-w-2xl">
                "ค้นหาเทรนเนอร์ที่ใช่สำหรับคุณ พร้อมจองคิวง่ายในไม่กี่คลิก"
              </p>
              <button
                className="mt-6 w-fit rounded-lg bg-white text-black font-bold px-6 py-2 shadow hover:bg-red-500 hover:text-white active:bg-red-600 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={() => (window.location.href = "/trainer")}
              >
                ค้นหาเทรนเนอร์
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ส่วนเทรนกับผู้เชี่ยวชาญ ===== */}
      <section className="py-16 sm:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-2xl p-8">
            {/* รูปภาพ */}
            <div>
              <img
                src="/images/trainer-session.jpg"
                alt="Personal training session"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            {/* ข้อความ */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                "เทรนกับผู้เชี่ยวชาญที่ผ่าน
                <br className="hidden sm:block" />
                การรับรอง"
              </h2>
              <p className="mb-8 text-lg text-gray-700 leading-relaxed">
                เทรนเนอร์ของเราผ่านการคัดเลือกอย่างเข้มงวด
                พร้อมคุณสมบัติแบบมืออาชีพเพื่อมอบประสบการณ์ที่ดีที่สุด
              </p>
              <a
                href="/trainer"
                className="inline-block bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 active:bg-gray-700 active:scale-95 transition-all duration-200"
              >
                ดูรายชื่อเทรนเนอร์
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== รีวิวจากลูกค้า ===== */}
      <section className="relative py-16 sm:py-20 bg-gray-100 overflow-hidden">
        {/* ลวดลาย background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%">
            <circle
              cx="10%"
              cy="20%"
              r="60"
              fill="#fbbf24"
              fillOpacity="0.08"
            />
            <circle
              cx="90%"
              cy="80%"
              r="80"
              fill="#f87171"
              fillOpacity="0.07"
            />
            <circle
              cx="50%"
              cy="10%"
              r="40"
              fill="#f87171"
              fillOpacity="0.06"
            />
            <circle
              cx="80%"
              cy="30%"
              r="30"
              fill="#fbbf24"
              fillOpacity="0.06"
            />
          </svg>
        </div>
        <h2 className="relative z-10 text-center text-3xl sm:text-4xl font-extrabold text-gray-800 drop-shadow-lg mb-12 tracking-wide">
          รีวิวจากลูกค้า
        </h2>

        <div className="relative z-10 max-w-5xl mx-auto flex items-center gap-4 px-6">
          <button
            onClick={handlePrev}
            className="hidden md:inline-flex w-14 h-14 rounded-full bg-white shadow-xl hover:bg-yellow-100 text-red-500 font-bold text-3xl items-center justify-center transition-all duration-200 border-2 border-red-200 hover:scale-110"
            aria-label="ก่อนหน้า"
            style={{ boxShadow: "0 4px 24px 0 rgba(251,191,36,0.10)" }}
          >
            &lt;
          </button>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10">
            {showReviews.map((review, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-3xl shadow-2xl p-8 text-center border border-yellow-100 hover:border-yellow-400 transition-all duration-300 group hover:scale-105"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(251,191,36,0.12)",
                  transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
                }}
              >
                {/* แถบเหลืองบน card */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-4 bg-yellow-400 rounded-b-xl shadow-md"></div>
                </div>
                {/* ไอคอนคำพูด */}
                <svg
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-300 opacity-80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 17c-2.21 0-4-1.79-4-4V7c0-2.21 1.79-4 4-4h10c2.21 0 4 1.79 4 4v6c0 2.21-1.79 4-4 4h-4l-4 4v-4H7z" />
                </svg>
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-yellow-300 shadow-lg group-hover:border-yellow-500 transition-all duration-300 bg-gray-100"
                />
                <div className="text-gray-800 font-bold mb-1">
                  {review.name}
                </div>
                <StarRow />
                <p className="mt-6 text-gray-600 text-base min-h-[72px] font-medium">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="hidden md:inline-flex w-14 h-14 rounded-full bg-white shadow-xl hover:bg-yellow-100 text-red-500 font-bold text-3xl items-center justify-center transition-all duration-200 border-2 border-red-200 hover:scale-110"
            aria-label="ถัดไป"
            style={{ boxShadow: "0 4px 24px 0 rgba(251,191,36,0.10)" }}
          >
            &gt;
          </button>
        </div>
        {/* จุด indicator */}
        <div className="relative z-10 flex justify-center gap-2 mt-10">
          {reviews.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-yellow-300 ${
                idx === reviewIndex % reviews.length
                  ? "bg-yellow-400 shadow-lg scale-125"
                  : "bg-white/80"
              }`}
            />
          ))}
        </div>
        {/* ปุ่ม mobile */}
        <div className="relative z-10 flex justify-center gap-4 mt-6 md:hidden">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-yellow-100 text-red-500 font-bold text-2xl flex items-center justify-center transition-all duration-200 border-2 border-red-200"
            aria-label="ก่อนหน้า"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-yellow-100 text-red-500 font-bold text-2xl flex items-center justify-center transition-all duration-200 border-2 border-red-200"
            aria-label="ถัดไป"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* ===== แพ็คเกจราคา ===== */}
      <section className="py-16 sm:py-20 bg-gray-100">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-red-600 mb-12">
          แพ็คเกจราคา
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Bronze */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative group transition-all duration-200">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold group-hover:ring-2 group-hover:ring-red-500 group-hover:ring-offset-2 transition-all duration-200">
                STARTER
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-6">
              Bronze
            </h3>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                เทรนเนอร์ออนไลน์สัปดาห์ละ 1 ครั้ง
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                วิดีโอท่าออกกำลังกายเฉพาะบุคคล
              </li>
              <li className="flex items-center text-red-500">
                <span className="mr-2">✗</span>
                ปรึกษาโภชนาการ
              </li>
              <li className="flex items-center text-red-500">
                <span className="mr-2">✗</span>
                ติดตามพัฒนาการรายเดือน
              </li>
            </ul>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              499 <span className="text-lg">/ สัปดาห์</span>
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer mb-2">
              เลือกแพ็กเกจนี้
            </button>
            <p className="text-gray-400 text-sm">ยกเลิกได้ทุกเมื่อ</p>
            {/* กรอบแดงเมื่อ hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
          </div>

          {/* Gold (Popular) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative group transition-all duration-200">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold group-hover:ring-2 group-hover:ring-red-500 group-hover:ring-offset-2 transition-all duration-200">
                POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Gold</h3>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                เทรนเนอร์ออนไลน์ 3 ครั้ง/สัปดาห์
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                วิดีโอท่าออกกำลังกายเฉพาะบุคคล
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                ปรึกษาโภชนาการ 1 ครั้ง/สัปดาห์
              </li>
              <li className="flex items-center text-red-500">
                <span className="mr-2">✗</span>
                ติดตามพัฒนาการรายเดือน
              </li>
            </ul>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              1,299 <span className="text-lg">/ สัปดาห์</span>
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer mb-2">
              เลือกแพ็กเกจยอดนิยม
            </button>
            <p className="text-gray-400 text-sm">ยกเลิกได้ทุกเมื่อ</p>
            {/* กรอบแดงเมื่อ hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
          </div>

          {/* Platinum */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative group transition-all duration-200">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold group-hover:ring-2 group-hover:ring-red-500 group-hover:ring-offset-2 transition-all duration-200">
                ENTERPRISE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-6">
              Platinum
            </h3>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                เทรนเนอร์ตัวต่อตัว/ออนไลน์ไม่จำกัดครั้ง
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                วิดีโอ/แผนการฝึกเฉพาะบุคคล
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                ปรึกษาโภชนาการทุกสัปดาห์
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                รายงานพัฒนาการทุกสัปดาห์
              </li>
            </ul>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              2,999 <span className="text-lg">/ เดือน</span>
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer mb-2">
              เลือกแพ็กเกจพรีเมียม
            </button>
            <p className="text-gray-400 text-sm">ยกเลิกได้ทุกเมื่อ</p>
            {/* กรอบแดงเมื่อ hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-10 bg-[#f3f4f6] relative overflow-hidden">
        {/* ของตกแต่ง: วงกลม/สี่เหลี่ยมโปร่งแสงแบบกลมกลืน */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-yellow-100 rounded-full opacity-40 z-0"></div>
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-30 z-0"></div>
        <div className="absolute -bottom-16 right-1/4 w-32 h-32 bg-red-100 rounded-full opacity-30 z-0"></div>
        <div className="absolute top-1/2 right-0 w-20 h-20 bg-yellow-200 rounded-lg opacity-30 z-0"></div>
        <div className="absolute top-0 right-10 w-24 h-24 bg-pink-100 rounded-lg opacity-20 z-0"></div>
        <div className="max-w-3xl mx-auto px-2 relative z-10">
          <div className="bg-white/90 text-gray-900 p-5 sm:p-7 rounded-xl flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-md gap-4 sm:gap-0">
            {/* รูป NEED HELP? ด้านซ้าย */}
            <div className="flex items-center z-10 min-w-[120px]">
              <div className="relative mr-3">
                {/* กระดาษสีต่างๆ */}
                <div className="absolute -rotate-12 w-14 h-10 bg-yellow-400 rounded-lg"></div>
                <div className="absolute rotate-6 w-14 h-10 bg-pink-400 rounded-lg"></div>
                <div className="w-14 h-10 bg-blue-400 rounded-lg flex items-center justify-center relative z-10">
                  <span className="text-black font-bold text-xs leading-tight">
                    NEED
                    <br />
                    HELP?
                  </span>
                </div>
              </div>
            </div>
            {/* ข้อความ */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-1">
                "อยากเริ่มต้นแปลี่ยนตัวเองใช่ไหม?"
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm">
                สมัครรับคำแนะนำฟรีจาก เทรนเนอร์และผู้เชี่ยวชาญ พิเศษก่อนใคร
              </p>
            </div>
            {/* Silhouette ด้านขวา */}
            <div className="absolute right-4 bottom-2 z-0">
              <div className="w-14 h-16 bg-yellow-200 opacity-30 rounded-lg rotate-12"></div>
            </div>
            <button
              onClick={() => router.push("/payment")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 cursor-pointer z-10 shadow text-sm sm:text-base"
            >
              สมัครเลย
            </button>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />
    </main>
  );
}
