import React, { useState } from "react";

export default function Contact() {
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
                { name: "contact us", href: "/contactus" },
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
          <div className="md:hidden bg-red-600 px-6 py-4">
            <nav className="flex flex-col gap-4">
              {[
                { name: "home", href: "/" },
                { name: "trainers", href: "/trainer" },
                { name: "reviews", href: "/review" },
                { name: "contact us", href: "/contactus" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white text-lg font-semibold"
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
              Contact Us
            </h1>
          </div>
        </div>
      </section>

      {/* ===== Contact Content ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ข้อมูลการติดต่อ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                อยากเริ่มต้นแปลี่ยนสุขภาพ?<br />
                ติดต่อเราได้เลยวันนี้!
              </h2>
              <p className="text-gray-600 mb-8">
                ทีมงานของเราพร้อมให้คำปรึกษา ออกแบบโปรแกรมออกกำลังกาย<br />
                และโภชนาการเพื่อให้คุณบรรลุเป้าหมายอย่างมีประสิทธิภาพ<br />
                ไม่ว่าจะเป็นการลดน้ำหนัก เพิ่มกล้ามเนื้อ หรือเสริมสร้างสุขภาพ
              </p>

              {/* แผนที่จริง */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
                <div className="h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d483.86173820629546!2d99.9786041114656!3d14.024302659372566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2ff840365e223%3A0x186beebdd6a65428!2z4Liq4Liy4LiC4Liy4Lin4Li04LiK4Liy4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Liq4Liy4Lij4Liq4LiZ4LmA4LiX4LioIOC4hOC4k-C4sOC4qOC4tOC4peC4m-C4qOC4suC4quC4leC4o-C5jOC5geC4peC4sOC4p-C4tOC4l-C4ouC4suC4qOC4suC4quC4leC4o-C5jA!5e0!3m2!1sth!2sth!4v1758218210147!5m2!1sth!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="แผนที่ใหม่"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">มหาวิทยาลัยเกษตรศาสตร์วิทยาเขตกำแพงแสน</h3>
                  <p className="text-gray-600 text-sm">
                    อาคารเทคโนโลยีสารสนเทศ ภายในมหาวิทยาลัยเกษตรศาสตร์วิทยาเขตกำแพงแสน<br />
                  </p>
                </div>
              </div>

              <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer">
                การติดต่อ
              </button>
            </div>

            {/* ฟอร์มติดต่อ */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                เราช่วยคุณได้อย่างไร?
              </h3>
              <p className="text-gray-600 text-center mb-8">
                กรุณากรอกข้อมูลการติดต่อ เราจะติดต่อกลับภายใน 24 ชั่วโมง
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อของคุณ
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หัวข้อที่อยากปรึกษา
                  </label>
                  <input
                    type="text"
                    placeholder="Add subject here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อความของคุณ
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your message here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 active:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
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
