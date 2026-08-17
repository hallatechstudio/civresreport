import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone } from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border-2 border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black">
            <Megaphone className="h-6 w-6 text-white" strokeWidth={2.2} />
          </div>
          <p className="text-xl font-bold tracking-tight text-black">Civres</p>
          <p className="text-sm text-black/55">Admin Portal</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          {error && (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border-2 border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border-2 border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-black/80"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
