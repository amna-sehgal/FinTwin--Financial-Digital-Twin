import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 md:px-10 py-5" style={{ background: "var(--sidebar-bg)", color: "white" }}>
      <h1 className="font-semibold text-lg tracking-wide">FinTwin</h1>

      <div className="flex items-center gap-3">
        <Link href="/login" className="px-5 py-2 rounded-lg font-medium hover:opacity-90" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
          Sign in
        </Link>
        <Link href="/signup" className="btn btn-primary hover:scale-105" style={{ boxShadow: "0 8px 25px rgba(162,167,248,0.5)" }}>
          Get started
        </Link>
      </div>
    </nav>
  );
}



