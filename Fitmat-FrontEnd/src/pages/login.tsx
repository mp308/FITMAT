import { useState } from "react";
import { useRouter } from "next/router";

type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
  message?: string;
};

type ErrorResponse = {
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          payload: { email, password },
        }),
      });

      const data = (await response.json()) as LoginResponse | ErrorResponse;

      if (!response.ok) {
        const message = "message" in data && data.message
          ? data.message
          : "Login failed. Please try again.";
        setErr(message);
        return;
      }

      localStorage.setItem("token", (data as LoginResponse).token);
      localStorage.setItem("role", (data as LoginResponse).user.role);
      router.push("/");
    } catch (error) {
      setErr("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-extrabold">
            <span className="text-red-600">F</span>
            <span className="text-slate-800">ITMATE</span>
          </div>
          <p className="text-slate-500 font-semibold tracking-wide mt-2">
            Sign in to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-slate-700 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-slate-100 text-slate-700 font-medium text-lg rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-100 text-slate-700 font-medium text-lg rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-2 text-sm text-center">
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-600 to-red-400 text-white text-xl font-bold py-3 rounded-lg shadow-lg transition-all duration-150 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:from-red-700 hover:to-red-500"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="w-full flex justify-between text-sm text-slate-600">
          <a href="/register" className="font-semibold text-blue-700 hover:underline">
            Create account
          </a>
          <a href="/forgotpass" className="font-semibold text-blue-700 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
}
