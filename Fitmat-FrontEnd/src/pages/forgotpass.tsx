import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfPassword, setCfPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCfPass, setShowCfPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== cfPassword) {
      setErr("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);
    // TODO: call API register
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1200);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-red-100">
      <div className="w-full max-w-md bg-white/90 p-10 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* วงกลมตกแต่ง */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-60 z-0" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-50 z-0" />
        {/* โลโก้และหัวข้อ */}
        <div className="flex flex-col items-center z-10">
          <div className="mb-4">
            <div className="flex items-center justify-center">
              <span className="text-4xl font-extrabold text-red-600 drop-shadow">F</span>
              <span className="text-4xl font-extrabold text-gray-700 drop-shadow">ITMATE</span>
            </div>
            <div className="text-gray-400 font-bold text-lg text-center tracking-widest mt-1">เข้าสู่ระบบ</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-5 z-10">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 ml-1" htmlFor="email">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full bg-gray-100 text-gray-700 font-medium text-lg rounded-lg px-5 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1 ml-1" htmlFor="password">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="รหัสผ่าน"
              className="w-full bg-gray-100 text-gray-700 font-medium text-lg rounded-lg px-5 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-red-400 transition pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-4 top-10 text-gray-600"
              tabIndex={-1}
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showPass ? (
                // ไอคอน "เปิดตา"
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              ) : (
                // ไอคอน "ปิดตา"
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1 ml-1" htmlFor="cfPassword">
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="cfPassword"
              type={showCfPass ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              className="w-full bg-gray-100 text-gray-700 font-medium text-lg rounded-lg px-5 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-red-400 transition pr-12"
              value={cfPassword}
              onChange={(e) => setCfPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-4 top-10 text-gray-600"
              tabIndex={-1}
              onClick={() => setShowCfPass((v) => !v)}
              aria-label={showCfPass ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showCfPass ? (
                // ไอคอน "เปิดตา"
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              ) : (
                // ไอคอน "ปิดตา"
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-2 text-sm text-center animate-shake">
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-600 to-red-400 text-white text-xl font-bold py-3 rounded-lg shadow-lg hover:from-red-700 hover:to-red-500 active:scale-95 transition-all duration-150 tracking-wider ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            style={{ letterSpacing: 1 }}
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-6 text-xs z-10 gap-2">
          <a
            href="/login"
            className="text-blue-800 font-bold hover:underline hover:text-blue-600 transition"
          >
            เข้าสู่ระบบ
          </a>
          <span className="hidden sm:inline-block text-gray-300">|</span>
          <a
            href="/forgotpass"
            className="text-blue-800 font-bold hover:underline hover:text-blue-600 transition"
          >
            ลืมรหัสผ่าน ?
          </a>
        </div>
      </div>
      <style jsx>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s;
        }
      `}</style>
    </main>
  );
}
