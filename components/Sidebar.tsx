"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login" || pathname === "/signup" || pathname === "/onboarding") {
    return null;
  }

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠" },
    { label: "Simulations", href: "/simulate", icon: "📊" },
    { label: "AI Planner", href: "/ai-planner", icon: "✨" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <aside
      className="w-72 min-h-screen p-8"
      style={{ background: "var(--sidebar-bg)", color: "white" }}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-bold">FinTwin</h1>
        <p className="text-sm opacity-70 mt-2">Welcome back</p>
      </div>

      <nav className="space-y-4">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[16px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 pt-6 border-t border-white/10">
        <button
          onClick={() => {
            document.cookie = "auth=; path=/; max-age=0";
            document.cookie = "onb=; path=/; max-age=0";
            router.push("/login");
          }}
          className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
