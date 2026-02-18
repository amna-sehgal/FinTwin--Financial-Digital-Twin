"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding } from "@/hooks/useAPI";
import {
  Wallet,
  Home,
  Receipt,
  PiggyBank,
  CreditCard,
  MapPin,
  AlertCircle
} from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const { submitOnboarding, loading, error: apiError } = useOnboarding();

  const [form, setForm] = useState({
    salary: "",
    rent: "",
    expenses: "",
    savings: "",
    emi: "",
    city: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!form.salary || parseFloat(form.salary) <= 0) {
      newErrors.salary = "Monthly salary is required and must be greater than 0";
    }
    if (!form.expenses || parseFloat(form.expenses) < 0) {
      newErrors.expenses = "Monthly expenses is required and must be >= 0";
    }
    if (!form.savings || parseFloat(form.savings) < 0) {
      newErrors.savings = "Current savings is required and must be >= 0";
    }
    if (!form.emi || parseFloat(form.emi) < 0) {
      newErrors.emi = "Debts/EMI is required and must be >= 0";
    }

    if (form.rent && parseFloat(form.rent) < 0) {
      newErrors.rent = "Rent cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      monthlySalary: parseFloat(form.salary),
      rent: form.rent ? parseFloat(form.rent) : 0,
      monthlyExpenses: parseFloat(form.expenses),
      currentSavings: parseFloat(form.savings),
      debts: parseFloat(form.emi),
      city: form.city || "Not specified",
    };

    const userId = await submitOnboarding(userData);
    if (userId) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl card p-6 md:p-10">
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Tell us about your finances
          </h1>
          <p className="text-sm mt-1 md:mt-2 text-[var(--text-muted)]">
            This helps us simulate your life decisions beautifully.
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          <Field icon={<Wallet />} label="Monthly Salary *" name="salary" onChange={handleChange} value={form.salary} error={errors.salary} />
          <Field icon={<Home />} label="Rent (Optional)" name="rent" onChange={handleChange} value={form.rent} error={errors.rent} />
          <Field icon={<Receipt />} label="Monthly Expenses *" name="expenses" onChange={handleChange} value={form.expenses} error={errors.expenses} />
          <Field icon={<PiggyBank />} label="Current Savings *" name="savings" onChange={handleChange} value={form.savings} error={errors.savings} />
          <Field icon={<CreditCard />} label="Debts / EMI *" name="emi" onChange={handleChange} value={form.emi} error={errors.emi} />
          <Field icon={<MapPin />} label="City (optional)" name="city" onChange={handleChange} value={form.city} error="" />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              md:col-span-2 w-full py-4 rounded-xl font-medium mt-4
              transition-all duration-300
              hover:shadow-lg hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{
              background: "var(--accent-green)",
              color: "var(--text-dark)",
            }}
          >
            {loading ? "Saving..." : "Continue →"}
          </button>

        </form>
      </div>
    </div>
  );
}

function Field({ icon, label, name, onChange, value, error }: any) {
  return (
    <div>
      <label className="text-sm mb-2 block">{label}</label>

      <div
        className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl border
        transition-all duration-300
        hover:shadow-md hover:scale-[1.01]
        focus-within:shadow-md focus-within:scale-[1.01]
        ${error ? "border-red-500 focus-within:ring-2 focus-within:ring-red-400" : "focus-within:ring-2 focus-within:ring-[var(--accent-blue)]"}
        `}
        style={{
          borderColor: error ? "#ef4444" : "var(--border)",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div
          className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ background: error ? "#fee2e2" : "var(--card-blue)" }}
        >
          {icon}
        </div>

        <input
          name={name}
          onChange={onChange}
          value={value}
          placeholder="Enter value"
          className="w-full bg-transparent outline-none"
          type="number"
          step="any"
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

