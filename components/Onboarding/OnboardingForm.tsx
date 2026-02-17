"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Wallet,
  Home,
  Receipt,
  PiggyBank,
  CreditCard,
  MapPin
} from "lucide-react";

export default function Onboarding() {
  const router = useRouter();

  const [form, setForm] = useState({
    salary: "",
    rent: "",
    expenses: "",
    savings: "",
    emi: "",
    city: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      {/* MAIN CARD */}
      <div
        className="w-full max-w-xl rounded-3xl p-10 shadow-xl border"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
      >
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Tell us about your finances
          </h1>
          <p className="text-sm mt-2 text-[var(--text-muted)]">
            This helps us simulate your life decisions beautifully.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Field icon={<Wallet />} label="Monthly Salary" name="salary" onChange={handleChange}/>
          <Field icon={<Home />} label="Rent" name="rent" onChange={handleChange}/>
          <Field icon={<Receipt />} label="Expenses" name="expenses" onChange={handleChange}/>
          <Field icon={<PiggyBank />} label="Savings" name="savings" onChange={handleChange}/>
          <Field icon={<CreditCard />} label="Debts / EMI" name="emi" onChange={handleChange}/>
          <Field icon={<MapPin />} label="City (optional)" name="city" onChange={handleChange}/>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full py-4 rounded-xl font-medium mt-6
              transition-all duration-300
              hover:shadow-lg hover:scale-[1.02]
              active:scale-[0.98]
            "
            style={{
              background: "var(--accent-green)",
              color: "var(--text-dark)",
            }}
          >
            Continue →
          </button>

        </form>
      </div>
    </div>
  );
}

function Field({ icon, label, name, onChange }: any) {
  return (
    <div>
      <label className="text-sm mb-2 block">{label}</label>

      <div
        className="
        group flex items-center gap-3 px-4 py-3 rounded-xl border
        transition-all duration-300
        hover:shadow-md hover:scale-[1.01]
        focus-within:shadow-md focus-within:scale-[1.01]
        focus-within:ring-2 focus-within:ring-[var(--accent-blue)]
        "
        style={{
          borderColor: "var(--border)",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div
          className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ background: "var(--card-blue)" }}
        >
          {icon}
        </div>

        <input
          name={name}
          onChange={onChange}
          placeholder="Enter value"
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

