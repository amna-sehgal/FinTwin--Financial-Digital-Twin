"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const userId = localStorage.getItem("userId");
    if (userId) {
      // User is authenticated - go to dashboard
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <Footer />
    </main>
  );
}
