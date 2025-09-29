"use client";

import { useEffect, useState } from "react";

const menuItems = [
  { name: "home", href: "/" },
  { name: "trainers", href: "/trainer" },
  { name: "reviews", href: "/review" },
  { name: "contact us", href: "/contactus" },
  { name: "fitmate class", href: "/fitmateclass" },
  { name: "login", href: "/login", authOnly: false },
  { name: "register", href: "/register", authOnly: false },

];

interface TokenPayload {
  exp?: number;
  role?: string;
  id?: number;
}

export default function Header() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<TokenPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checkedToken, setCheckedToken] = useState(false);

  function parseJwt(storedToken: string): TokenPayload | null {
    try {
      const base64Url = storedToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setCheckedToken(true);
      return;
    }

    setToken(storedToken);

    const payload = parseJwt(storedToken);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      setUser(payload);
    }

    setCheckedToken(true);
  }, []);

  // ✅ ถ้ามี user filter ไม่เอา login/register
  let filteredMenu = menuItems.filter(
    (item) => !(user && (item.name === "login" || item.name === "register"))
  );

  // ✅ ถ้ามี role เป็น ADMIN เพิ่มเมนู Customer Management
  if (user?.role === "ADMIN") {
    filteredMenu = [
      ...filteredMenu,
      { name: "customer management", href: "/customermanagementsystem" },
    ];
  }

  return (
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
            {filteredMenu.map((item) => (
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
            {filteredMenu.map((item) => (
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
  );
}
