import React, { useState } from "react";

export default function Review() {
  const [open, setOpen] = useState(false);

  return (
    <main className="w-full text-gray-800">
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
                { name: "trainers", href: "/trainer" },
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
              className="md:hidden flex items-center text-white border-2 border-white rounded p-1"
              onClick={() => setOpen(!open)}
              aria-label="Open menu"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 7h16M4 12h16M4 17h16"
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
                { name: "trainers", href: "/trainer" },
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

      {/* ===== Highlight Stats & Why Us ===== */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-red-500 text-5xl font-extrabold">99.9%</span>
              <span className="text-gray-800 font-bold text-lg">
                ลูกค้ารู้สึกพึงพอใจ กับเทรนเนอร์ที่เลือกผ่านเรา
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-500 text-5xl font-extrabold">4.9</span>
              <div>
                <div className="flex gap-1 text-yellow-400 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-800 font-bold text-lg">คะแนนเฉลี่ยรีวิวจากผู้ใช้จริง</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-500 text-5xl font-extrabold">300+</span>
              <span className="text-gray-800 font-bold text-lg">
                ลูกค้าที่ประสบความสำเร็จและกลับมาใช้บริการซ้ำ
              </span>
            </div>
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
                ด้วยทีมงานเทรนเนอร์คุณภาพ ที่ผ่านคัดเลือกและมีประสบการณ์จริง พร้อมดูแลและให้คำแนะนำอย่างใกล้ชิด
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
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">บริการของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img src="/images/service1.jpg" alt="วางแผนการออกกำลังกาย" className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-lg mb-2">วางแผนการออกกำลังกาย</h3>
              <p className="text-gray-600 mb-4">
                ออกแบบโปรแกรมเฉพาะบุคคล โดยเทรนเนอร์มืออาชีพตามเป้าหมายที่คุณต้องการ
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img src="/images/service2.jpg" alt="วิเคราะห์พฤติกรรมและไลฟ์สไตล์" className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-lg mb-2">วิเคราะห์พฤติกรรมและไลฟ์สไตล์</h3>
              <p className="text-gray-600 mb-4">
                ทีมงานมืออาชีพช่วยวิเคราะห์และให้คำแนะนำเพื่อผลลัพธ์ที่ดีที่สุด
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-red-500">
              <img src="/images/service3.jpg" alt="ติดตามผลอย่างใกล้ชิด" className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-lg mb-2">ติดตามผลอย่างใกล้ชิด</h3>
              <p className="text-gray-600 mb-4">
                เทรนเนอร์คอยติดตามและปรับแผนอย่างต่อเนื่อง พร้อมรายงานผลลัพธ์ให้คุณทราบ
              </p>
              <span className="text-red-500 font-semibold">ขอข้อมูลบริการ</span>
            </div>
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
                href="https://www.youtube.com/@%E0%B8%84%E0%B8%93%E0%B8%B0%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%81"
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
