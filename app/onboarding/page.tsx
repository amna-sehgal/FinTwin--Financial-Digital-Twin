"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "../../components/Onboarding/OnboardingForm";

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (should have userId from signup)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Not authenticated - redirect to signup
      router.push("/signup");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
      <OnboardingForm />
    </main>
  );
}
