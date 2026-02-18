"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      // Not authenticated - redirect to login
      router.push("/login");
    } else {
      setUserId(storedUserId);
      setIsLoading(false);
    }
  }, [router]);

  // Always render the same component structure - just show loading or dashboard
  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      ) : (
        <Dashboard />
      )}
    </>
  );
}
