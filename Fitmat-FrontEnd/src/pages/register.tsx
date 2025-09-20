import { useState } from "react";
import { useRouter } from "next/router";

type RegisterResponse = {
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

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          payload: { email, password },
        }),
      });

      const data = (await response.json()) as RegisterResponse | ErrorResponse;

      if (!response.ok) {
        const message = "message" in data && data.message
          ? data.message
          : "Registration failed. Please try again.";
        setErr(message);
        return;
      }

      router.push("/login");
    } catch (error) {
      setErr("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-extrabold">
            <span className="text-red-600">F</span>
            <span className="text-slate-800">ITMATE</span>
          </div>
          <p className="text-slate-500 font-semibold tracking-wide mt-2">
            Create your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-slate-100 text-slate-700 font-medium text-base rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="relative">
            <label className="block text-slate-700 font-bold mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full bg-slate-100 text-slate-700 font-medium text-base rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-slate-500"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-slate-700 font-bold mb-1" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-slate-100 text-slate-700 font-medium text-base rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-slate-500"
              onClick={() => setShowConfirmPassword((value) => !value)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {err && (
            <p className="text-red-600 text-sm text-center">{err}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-500 to-red-400 text-white text-xl font-bold py-3 rounded-md shadow transition-all duration-150 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:from-red-600 hover:to-red-500"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="w-full flex justify-between text-sm text-slate-600">
          <a href="/login" className="font-semibold text-blue-700 hover:underline">
            Already have an account?
          </a>
          <a href="/forgotpass" className="font-semibold text-blue-700 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
}
