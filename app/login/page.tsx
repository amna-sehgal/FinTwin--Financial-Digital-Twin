 "use client";
 
 import { useState } from "react";
 import Link from "next/link";
 import { useRouter } from "next/navigation";
 
 export default function LoginPage() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
 
   const onSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);
 
     const emailOk = /\S+@\S+\.\S+/.test(email);
     const passOk = password.length >= 6;
     if (!emailOk || !passOk) {
       setError("Enter a valid email and a password of at least 6 characters.");
       return;
     }
 
    setLoading(true);
     await new Promise((r) => setTimeout(r, 600));
    document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 30}`;
     router.push("/dashboard");
   };
 
   return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <div className="w-full max-w-md card p-8">
         <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-1">Welcome back</h1>
         <p className="text-sm text-[var(--text-muted)] mb-6">
           Sign in to continue to FinTwin
         </p>
 
         {error && (
           <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
             {error}
           </div>
         )}
 
         <form onSubmit={onSubmit} className="space-y-4">
           <div>
             <label className="block text-sm mb-1">Email</label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
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
               className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
               placeholder="••••••••"
               autoComplete="current-password"
             />
           </div>
 
          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 hover:opacity-90 disabled:opacity-60">
             {loading ? "Signing in..." : "Sign in"}
           </button>
         </form>
 
         <div className="text-sm text-[var(--text-muted)] mt-6 text-center">
           Don&apos;t have an account?{" "}
           <Link href="/signup" className="text-[var(--text-dark)] font-semibold underline">
             Create one
           </Link>
         </div>
       </div>
     </div>
   );
 }
 
