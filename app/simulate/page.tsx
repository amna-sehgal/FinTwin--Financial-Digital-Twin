"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  const [decisionType, setDecisionType] = useState<"emi" | "subscription" | "income">("emi");
  const [amount, setAmount] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [months, setMonths] = useState(12);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [result, setResult] = useState<any>(null);

  // base (unchanged)
  const income = 30000;
  const expenses = 15000;
  const savings = 50000;
  const goal = 500000; // financial freedom target

  useEffect(() => {}, []);

  const isValid = useMemo(() => {
    if (decisionType === "emi") return amount > 0 && months > 0;
    if (decisionType === "subscription") return monthlyCost > 0;
    return monthlyIncome > 0;
  }, [decisionType, amount, months, monthlyCost, monthlyIncome]);

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
    const projection: number[] = [];

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
      emi:
        decisionType === "emi"
          ? (amount - downPayment) / months
          : decisionType === "subscription"
          ? monthlyCost
          : -monthlyIncome,
      projection,
      stress,
      monthsWithoutCar,
      monthsWithCar,
      delay,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--main-bg)" }}>
      {/* ---- dashboard-like visuals (human feel) ---- */}
      <style>{`
        .__blob1 { background: rgba(162,167,248,0.22); filter: blur(42px); }
        .__blob2 { background: rgba(243,212,137,0.18); filter: blur(46px); }
        .__card { background: rgba(255,255,255,0.62); border: 1px solid var(--border); }
        .__soft { background: rgba(202,205,194,0.22); border: 1px solid var(--border); }
      `}</style>

      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="__blob1 absolute -top-28 -left-28 h-[360px] w-[360px] rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="__blob2 absolute top-24 -right-28 h-[420px] w-[420px] rounded-full"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-7 md:mb-8"
        >
          <div
            className="text-[12px] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.62)", border: "1px solid var(--border)" }}
          >
            Decision simulator
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] md:text-[30px] font-bold leading-tight" style={{ color: "var(--text-dark)" }}>
                Explore your choices
              </h1>
              <p className="mt-1 text-sm md:text-[15px]" style={{ color: "var(--text-muted)" }}>
                Adjust inputs and see the impact on savings + time to financial freedom.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="px-3 py-2 rounded-xl __soft">
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Base income</div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>₹30,000</div>
              </div>
              <div className="px-3 py-2 rounded-xl __soft">
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Base expenses</div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>₹15,000</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left: inputs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="lg:col-span-6 __card rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-dark)" }}>
                  Enter decision details
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Keep it simple — just the key numbers.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Pill label="12-month view" />
              </div>
            </div>

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
                label={
                  decisionType === "emi"
                    ? "Item price"
                    : decisionType === "subscription"
                    ? "Monthly cost"
                    : "Monthly income"
                }
                hint={
                  decisionType === "emi"
                    ? "Total price of the item you’re buying."
                    : decisionType === "subscription"
                    ? "Your new recurring monthly cost."
                    : "How much extra you earn monthly."
                }
                icon={
                  decisionType === "emi" ? <Car size={18} /> : decisionType === "subscription" ? <Receipt size={18} /> : <TrendingUp size={18} />
                }
                value={decisionType === "emi" ? amount : decisionType === "subscription" ? monthlyCost : monthlyIncome}
                onChange={(v) => {
                  if (decisionType === "emi") setAmount(v);
                  else if (decisionType === "subscription") setMonthlyCost(v);
                  else setMonthlyIncome(v);
                }}
              />

              {decisionType === "emi" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Down payment"
                    hint="Paid upfront (reduces EMI)."
                    icon={<Wallet size={18} />}
                    value={downPayment}
                    onChange={(v) => setDownPayment(v)}
                  />
                  <Field
                    label="EMI months"
                    hint="How many months you repay."
                    icon={<CreditCard size={18} />}
                    value={months}
                    onChange={(v) => setMonths(v)}
                  />
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <motion.button
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              whileHover={reduceMotion ? undefined : { y: -1 }}
              onClick={runSimulation}
              disabled={!isValid}
              className="px-6 py-3.5 rounded-2xl font-semibold w-full mt-7 transition"
              style={{
                background: isValid ? "var(--accent-blue)" : "rgba(162,167,248,0.45)",
                color: "white",
                boxShadow: isValid ? "0 12px 26px rgba(0,0,0,0.10)" : "none",
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              Run Simulation
            </motion.button>

            {!isValid && (
              <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                Fill the required field(s) to run the simulation.
              </div>
            )}

            {/* tiny “human” footer */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniTile label="Income" value="₹30k" />
              <MiniTile label="Expenses" value="₹15k" />
              <MiniTile label="Goal" value="₹5L" />
            </div>
          </motion.div>

          {/* Right: output (sticky on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="lg:sticky lg:top-6 __card rounded-3xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-dark)" }}>
                    Simulation output
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Clear results you can explain to judges.
                  </p>
                </div>

                {result?.stress && (
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      border: "1px solid var(--border)",
                      background:
                        result.stress === "HIGH RISK"
                          ? "rgba(243,212,137,0.28)"
                          : result.stress === "MODERATE"
                          ? "rgba(162,167,248,0.18)"
                          : "rgba(120, 200, 140, 0.18)",
                      color: "var(--text-dark)",
                    }}
                  >
                    {result.stress}
                  </span>
                )}
              </div>

              {!result && (
                <div className="rounded-2xl p-5 __soft">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Run simulation to see results.
                  </p>
                </div>
              )}

              {result && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <Stat
                      label={
                        decisionType === "income"
                          ? "Monthly Change"
                          : decisionType === "subscription"
                          ? "Monthly Cost"
                          : "Monthly EMI"
                      }
                      value={
                        <CountUp
                          end={Math.round(Math.abs(result.emi))}
                          prefix={decisionType === "income" ? "+₹" : "₹"}
                        />
                      }
                    />
                    <Stat label="Stress" value={result.stress} tone={result.stress} />
                    <Stat
                      label="Goal Delay"
                      value={<CountUp end={result.delay} suffix=" mo" />}
                      tone={result.delay > 0 ? "HIGH RISK" : "SAFE"}
                    />
                  </div>

                  <div className="rounded-2xl p-3 __soft mb-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={result.projection.map((value: number, index: number) => ({
                            month: `M${index + 1}`,
                            balance: value,
                          }))}
                        >
                          <XAxis dataKey="month" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} width={40} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 10,
                              border: "1px solid rgb(202,205,194)",
                              background: "rgb(248,247,242)",
                              color: "rgb(44,44,43)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="rgb(162,167,248)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border"
                    style={{
                      background: "rgba(162,167,248,0.10)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="font-semibold mb-2" style={{ color: "var(--text-dark)" }}>
                      Financial Freedom Impact
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Without decision: <b style={{ color: "var(--text-dark)" }}>{result.monthsWithoutCar}</b> months
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      With decision: <b style={{ color: "var(--text-dark)" }}>{result.monthsWithCar}</b> months
                    </p>
                    <p className="mt-3 font-semibold" style={{ color: "var(--text-dark)" }}>
                      You delay your goal by{" "}
                      <span style={{ color: result.delay > 0 ? "rgb(220, 38, 38)" : "rgb(16, 185, 129)" }}>
                        {result.delay} months
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI components (same logic, better UX) ---------------- */

function Pill({ label }: { label: string }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-semibold"
      style={{
        background: "rgba(202,205,194,0.22)",
        border: "1px solid var(--border)",
        color: "var(--text-dark)",
      }}
    >
      {label}
    </span>
  );
}

function MiniTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl px-4 py-3 __soft">
      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>{value}</div>
    </div>
  );
}

function Field({ label, hint, icon, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block" style={{ color: "var(--text-dark)" }}>
        {label}
      </label>
      {hint ? (
        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          {hint}
        </div>
      ) : null}

      <div
        className="group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all focus-within:ring-2"
        style={{
          borderColor: "var(--border)",
          background: "rgba(255,255,255,0.75)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-2 rounded-xl" style={{ background: "var(--card-blue)" }}>
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent outline-none"
          placeholder="Enter value"
          style={{ color: "var(--text-dark)" }}
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
  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function Stat({ label, value, tone }: any) {
  let color = "var(--text-dark)";
  let bg = "rgba(255,255,255,0.62)";

  if (tone === "HIGH RISK") {
    color = "rgb(220, 38, 38)";
    bg = "rgba(220, 38, 38, 0.08)";
  } else if (tone === "MODERATE") {
    color = "rgb(234, 179, 8)";
    bg = "rgba(234, 179, 8, 0.10)";
  } else if (tone === "SAFE") {
    color = "rgb(16, 185, 129)";
    bg = "rgba(16, 185, 129, 0.10)";
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="p-4 rounded-2xl border"
      style={{ background: bg, borderColor: "var(--border)" }}
    >
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-lg font-semibold mt-1" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block" style={{ color: "var(--text-dark)" }}>
        {label}
      </label>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
        style={{
          borderColor: "var(--border)",
          background: "rgba(255,255,255,0.75)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-2 rounded-xl" style={{ background: "var(--card-blue)" }}>
          {options.find((o: any) => o.value === value)?.icon}
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
          style={{ color: "var(--text-dark)" }}
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
