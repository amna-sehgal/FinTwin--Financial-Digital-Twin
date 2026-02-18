 "use client";
 
 import { useState } from "react";
 import Link from "next/link";
 import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/useAPI";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error: apiError } = useSignup();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailOk = /\S+@\S+\.\S+/.test(email);
    const passOk = password.length >= 6 && password === confirm;
    const nameOk = name.trim().length > 1;
    if (!emailOk || !passOk || !nameOk) {
      setError(
        "Fill all fields correctly. Password must be at least 6 characters and match."
      );
      return;
    }

    const userId = await signup(name, email, password, confirm);
    if (userId) {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-1">Create your account</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Start planning with your Financial Digital Twin
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {apiError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
            {apiError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              placeholder="Alex Johnson"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-sm text-[var(--text-muted)] mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--text-dark)] font-semibold underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
 }
 
