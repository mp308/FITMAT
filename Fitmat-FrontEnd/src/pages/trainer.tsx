import React, { useState } from "react";

export default function Trainer() {
  const [open, setOpen] = useState(false);

  return (
    <main className="w-full text-gray-800 bg-gray-100">
      {/* ===== Header ===== */}
      <header className="absolute top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            {/* โลโก้ */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide">
                <span className="text-red-500">FIT</span>MATE
              </span>
            </a>
            {/* เมนู desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { name: "home", href: "/" },
                { name: "trainers", href: "/trainer" }, // <-- เชื่อมไป trainer.tsx
                { name: "reviews", href: "/review" },
                { name: "contact us", href: "/contactus" }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white text-lg font-semibold hover:text-red-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            {/* Hamburger icon mobile */}
            <button
              className="md:hidden flex items-center text-white"
              onClick={() => setOpen(!open)}
              aria-label="Open menu"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-red-600 px-6 py-8">
            <nav className="flex flex-col gap-6">
              {[
                { name: "home", href: "/" },
                { name: "trainers", href: "/trainer" }, // <-- เชื่อมไป trainer.tsx
                { name: "reviews", href: "/review" },
                { name: "contact us", href: "/contactus" }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white text-xl font-bold"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

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
                เทรนเนอร์มืออาชีพของเรา<br />
                พร้อมช่วยคุณบรรลุเป้าหมายด้านสุขภาพและฟิตเนส<br />
                ด้วยประสบการณ์และความเข้าใจในแต่ละเป้าหมายของลูกค้าอย่างแท้จริง
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img src="/images/icon1.png" alt="icon1" className="w-12 h-12" />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">พร้อมให้คำปรึกษาฟรีก่อนเริ่มทุกคอร์ส</div>
              <div className="text-gray-500 text-sm">สอบถามได้ทุกเรื่องสุขภาพ</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img src="/images/icon2.png" alt="icon2" className="w-12 h-12" />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">เชี่ยวชาญกับงานเทรนนิ่งและการดีไซน์</div>
              <div className="text-gray-500 text-sm">ออกแบบโปรแกรมเฉพาะบุคคล</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img src="/images/icon3.png" alt="icon3" className="w-12 h-12" />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">เทรนเนอร์ได้รับการรับรองจากสถาบันชั้นนำ</div>
              <div className="text-gray-500 text-sm">มั่นใจในมาตรฐาน</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 rounded-2xl shadow-lg py-8 px-4 hover:scale-105 transition-transform duration-200 border border-red-100">
              <div className="bg-white rounded-full p-4 mb-3 shadow-lg shadow-red-100">
                <img src="/images/icon4.png" alt="icon4" className="w-12 h-12" />
              </div>
              <div className="font-bold text-gray-800 mb-1 text-lg">รีวิวจากลูกค้ากว่า 500+ คน</div>
              <div className="text-gray-500 text-sm">ความประทับใจจริงจากผู้ใช้บริการ</div>
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
              เรามุ่งมั่นที่จะช่วยให้คุณไปถึงเป้าหมายสุขภาพด้วยโปรแกรมการฝึกที่ออกแบบเฉพาะบุคคล พร้อมให้คำแนะนำเรื่องการออกกำลังกาย และโภชนาการ
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl shadow p-4 flex flex-col items-center">
                <img
                  src={`/images/trainer${i}.jpg`}
                  alt={`เทรนเนอร์ ${i}`}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  2023
                </div>
                <div className="font-bold text-lg mb-1">ชื่อเทรนเนอร์ {i}</div>
                <div className="text-gray-600 text-sm mb-2">ตำแหน่ง / ความถนัด</div>
                <div className="flex gap-1 text-yellow-400 justify-center" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} viewBox="0 0 20 20" className="w-5 h-5 fill-current">
                      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* ===== Footer ===== */}
      <footer className="bg-red-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-2xl font-extrabold mb-4">FITMATE</h4>
            <p className="text-red-100 text-sm leading-6">
              เปลี่ยนพลังงานให้เป็นรูปร่างในแบบของคุณ ออกแบบโปรแกรมเวิร์คเอาต์ให้เหมาะกับแต่ละคน
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">สำนักงานใหญ่</h5>
            <p className="text-red-100 text-sm leading-6">
              มหาวิทยาลัยเกษตรศาสตร์<br />
              วิทยาเขตกำแพงแสน<br />
              1 หมู่ 6 ถนนมาลัยแมน<br />
              ตำบลกำแพงแสน อำเภอกำแพงแสน<br />
              จังหวัดนครปฐม 73140<br />
              ประเทศไทย 
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">หน้าเรา</h5>
            <ul className="space-y-2 text-red-100 text-sm">
              <li>
                <a href="/contactus" className="hover:text-white">เกี่ยวกับเรา</a>
              </li>
              <li>
                <a href="/trainer" className="hover:text-white">เทรนเนอร์ทั้งหมด</a>
              </li>
              <li>
                <a href="/review" className="hover:text-white">รีวิวลูกค้า</a>
              </li>
              <li>
                <a href="/contactus" className="hover:text-white">ติดต่อเรา</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">social links</h5>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/ITKUKPS/?locale=th_TH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center transition"
              >
                <img src="/images/face001.png" alt="Facebook" className="w-8 h-8 object-cover" />
              </a>
              <a
                href="https://www.instagram.com/flaskukps/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center transition"
              >
                <img src="/images/ig001.png" alt="Instagram" className="w-8 h-8 object-cover" />
              </a>
              <a
                href="https://www.youtube.com/@%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%A1%E0%B8%81"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center transition"
              >
                <img src="/images/yt001.png" alt="YouTube" className="w-8 h-8 object-cover" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}