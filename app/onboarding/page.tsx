"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "../../components/Onboarding/OnboardingForm";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated (should have userId from signup)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Not authenticated - redirect to signup
      router.push("/signup");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
      <OnboardingForm />
    </main>
  );
}
