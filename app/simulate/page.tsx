"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Car, Wallet, CreditCard, Receipt, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SimulatePage() {

  const [decisionType, setDecisionType] = useState<"emi" | "subscription" | "income">("emi");
  const [amount, setAmount] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [months, setMonths] = useState(12);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [result, setResult] = useState<any>(null);

  const income = 30000;
  const expenses = 15000;
  const savings = 50000;
  const goal = 500000; // financial freedom target

  useEffect(() => {}, []);

  const runSimulation = () => {
    let delta = 0;
    if (decisionType === "emi") {
      if (!amount || !months) return;
      const emi = (amount - downPayment) / months;
      delta = -emi;
    } else if (decisionType === "subscription") {
      if (!monthlyCost) return;
      delta = -monthlyCost;
    } else if (decisionType === "income") {
      if (!monthlyIncome) return;
      delta = monthlyIncome;
    }

    const leftover = income - expenses + delta;

    let balance = savings;
    const projection = [];

    for (let i = 0; i < 12; i++) {
      balance += leftover;
      projection.push(balance);
    }

    const ratio = leftover / income;

    let stress = "SAFE";
    if (ratio < 0.2) stress = "HIGH RISK";
    else if (ratio < 0.4) stress = "MODERATE";

    const monthsWithoutCar = Math.ceil((goal - savings) / (income - expenses));
    const monthsWithCar = Math.ceil((goal - savings) / leftover);
    const delay = monthsWithCar - monthsWithoutCar;

    setResult({
      emi: decisionType === "emi" ? (amount - downPayment) / months : decisionType === "subscription" ? monthlyCost : -monthlyIncome,
      projection,
      stress,
      monthsWithoutCar,
      monthsWithCar,
      delay,
    });
  };

  return (
    <div className="p-8 md:p-10 min-h-screen" style={{ background: "var(--main-bg)" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="text-[13px] text-[var(--text-muted)] mb-1 inline-flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.6)" }}>
          Decision simulator
        </div>
        <h1 className="text-2xl font-semibold">Explore your choices</h1>
        <p className="text-sm text-[var(--text-muted)]">Adjust inputs and see impact on savings and financial freedom</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl border"
          style={{ background: "rgba(255,255,255,0.6)", borderColor: "var(--border)" }}
        >
          <h3 className="font-semibold mb-5">Enter decision details</h3>

          <div className="space-y-4">
            <SelectField
              label="Decision type"
              value={decisionType}
              onChange={(v: "emi" | "subscription" | "income") => setDecisionType(v)}
              options={[
                { label: "One-time purchase (EMI)", value: "emi", icon: <Car size={16} /> },
                { label: "Monthly subscription", value: "subscription", icon: <Receipt size={16} /> },
                { label: "Monthly income increase", value: "income", icon: <TrendingUp size={16} /> },
              ]}
            />
            <Field
              label={decisionType === "emi" ? "Item price" : decisionType === "subscription" ? "Monthly cost" : "Monthly income"}
              icon={decisionType === "emi" ? <Car size={18} /> : decisionType === "subscription" ? <Receipt size={18} /> : <TrendingUp size={18} />}
              value={decisionType === "emi" ? amount : decisionType === "subscription" ? monthlyCost : monthlyIncome}
              onChange={(v) => {
                if (decisionType === "emi") setAmount(v);
                else if (decisionType === "subscription") setMonthlyCost(v);
                else setMonthlyIncome(v);
              }}
            />
            {decisionType === "emi" && (
              <>
                <Field
                  label="Down payment"
                  icon={<Wallet size={18} />}
                  value={downPayment}
                  onChange={(v) => setDownPayment(v)}
                />
                <Field
                  label="EMI months"
                  icon={<CreditCard size={18} />}
                  value={months}
                  onChange={(v) => setMonths(v)}
                />
              </>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={runSimulation}
            className="px-6 py-3 rounded-xl font-semibold w-full mt-6"
            style={{ background: "var(--accent-blue)", color: "white" }}
          >
            Run Simulation
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl border"
          style={{ background: "rgba(255,255,255,0.6)", borderColor: "var(--border)" }}
        >
          <h3 className="font-semibold mb-5">Simulation output</h3>

          {!result && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Run simulation to see results.</p>
          )}

          {result && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Stat label={decisionType === "income" ? "Monthly Change" : decisionType === "subscription" ? "Monthly Cost" : "Monthly EMI"} value={<CountUp end={Math.round(Math.abs(result.emi))} prefix={decisionType === "income" ? "+₹" : "₹"} />} />
                <Stat label="Stress" value={result.stress} tone={result.stress} />
                <Stat label="Goal Delay" value={<CountUp end={result.delay} suffix=" mo" />} tone={result.delay > 0 ? "HIGH RISK" : "SAFE"} />
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={result.projection.map((value: number, index: number) => ({
                      month: `M${index + 1}`,
                      balance: value,
                    }))}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="balance" stroke="rgb(162,167,248)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="p-4 rounded-2xl border" style={{ background: "rgba(162,167,248,0.1)", borderColor: "var(--border)" }}>
                <p className="font-semibold mb-2">Financial Freedom Impact</p>
                <p className="text-sm">Without decision: {result.monthsWithoutCar} months</p>
                <p className="text-sm">With decision: {result.monthsWithCar} months</p>
                <p className="mt-2 font-semibold">
                  You delay your goal by <span style={{ color: "red" }}>{result.delay} months</span>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm mb-1 block">{label}</label>
      <div
        className="group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--accent-blue)]"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.75)" }}
      >
        <div className="p-2 rounded-lg" style={{ background: "var(--card-blue)" }}>{icon}</div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent outline-none"
          placeholder="Enter value"
        />
      </div>
    </div>
  );
}
function CountUp({ end, prefix = "", suffix = "" }: any) {
  const [val, setVal] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.floor(end * p));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [end]);
  const formatted = val.toLocaleString();
  return <span>{prefix}{formatted}{suffix}</span>;
}

function Stat({ label, value, tone }: any) {
  let color = "var(--text-dark)";
  if (tone === "HIGH RISK") color = "red";
  else if (tone === "MODERATE") color = "orange";
  else if (tone === "SAFE") color = "green";
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.6)", borderColor: "var(--border)" }}>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-lg font-semibold mt-1" style={{ color }}>{value}</p>
    </motion.div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-sm mb-1 block">{label}</label>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.75)" }}
      >
        <div className="p-2 rounded-lg" style={{ background: "var(--card-blue)" }}>
          {options.find((o: any) => o.value === value)?.icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
        >
          {options.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
