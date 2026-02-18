"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  AlertCircle,
  Brain,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  YAxis,
} from "recharts";
import { useDashboard } from "@/hooks/useAPI";

type BarPoint = { month: string; balance: number };
type PiePoint = { name: string; value: number };

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function tint(varName: string, alpha: number) {
  return `color-mix(in srgb, var(${varName}) ${Math.round(alpha * 100)}%, white)`;
}

/** small hook: animates number up (human-feel KPI motion) */
function useCountUp(target: number, duration = 900) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(from + (target - from) * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);

  return val;
}

export default function Dashboard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { fetchDashboard, data: responseData, loading, error } = useDashboard();

  const [userId, setUserId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if userId exists in localStorage
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setHasError(true);
      return;
    }

    setUserId(storedUserId);
    // Fetch dashboard data
    fetchDashboard(storedUserId);
  }, [fetchDashboard]);

  // Extract data from response
  const dashboardData = responseData?.metrics;
  const userData = responseData?.userData;

  // Transform API data to chart format
  const barData: BarPoint[] = useMemo(() => {
    if (!dashboardData?.projectedBalance || dashboardData.projectedBalance.length === 0) {
      return [];
    }
    return dashboardData.projectedBalance.map((item) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(item.month - 1) % 12],
      balance: item.balance,
    }));
  }, [dashboardData?.projectedBalance]);

  const trendData = useMemo(
    () => {
      if (!barData.length) return [];
      return barData.map((b, i) => ({
        month: b.month,
        score: Math.min(100, Math.round(dashboardData?.stressScore || 50) - 20 + i * 3),
      }));
    },
    [barData, dashboardData?.stressScore]
  );

  const pieData: PiePoint[] = useMemo(() => {
    if (!userData) {
      return [
        { name: "Savings", value: 40 },
        { name: "Expenses", value: 35 },
        { name: "Rent", value: 25 },
      ];
    }
    
    // Create realistic pie chart from the user's data
    const totalMonthly = userData.monthlySalary || 100000;
    const expensesPercent = userData.monthlyExpenses ? (userData.monthlyExpenses / totalMonthly) * 100 : 30;
    const rentPercent = userData.rent ? (userData.rent / totalMonthly) * 100 : 0;
    const debtsPercent = userData.debts ? (userData.debts / totalMonthly) * 100 : 0;
    // Remaining is savings/other
    const savingsPercent = Math.max(0, 100 - expensesPercent - rentPercent - debtsPercent);

    return [
      { name: "Expenses", value: Math.round(expensesPercent) },
      { name: "Rent/Home", value: Math.round(rentPercent) },
      { name: "Debts/EMI", value: Math.round(debtsPercent) },
      { name: "Savings/Other", value: Math.round(savingsPercent) },
    ].filter(p => p.value > 0);
  }, [userData]);

  const COLORS = ["var(--accent-green)", "var(--accent-blue)", "var(--accent-gold)", "var(--accent-purple)", "var(--accent-red)"];

  // Show error if no user account
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(220, 38, 38, 0.1)" }}
          >
            <AlertCircle size={32} style={{ color: "rgb(220, 38, 38)" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-dark)" }}>
            No Account Found
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Please create an account first by completing the onboarding process.
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-6 py-2 rounded-lg font-semibold"
            style={{ background: "rgb(162, 167, 248)", color: "white" }}
          >
            Go to Onboarding
          </Link>
        </div>
      </div>
    );
  }

  // Show error if API fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(220, 38, 38, 0.1)" }}
          >
            <AlertCircle size={32} style={{ color: "rgb(220, 38, 38)" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-dark)" }}>
            Error Loading Dashboard
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {error}
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-6 py-2 rounded-lg font-semibold"
            style={{ background: "rgb(162, 167, 248)", color: "white" }}
          >
            Go to Onboarding
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--main-bg)" }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full mx-auto mb-4"
            style={{ border: "2px solid var(--border)", borderTopColor: "rgb(162, 167, 248)" }}
          />
          <p style={{ color: "var(--text-muted)" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get user identifier
  const userCity = userData?.city || "User";
  const userInitial = userCity.charAt(0).toUpperCase();

  // ✅ “Hackathon killer” detail: highlight the latest bar on a timed loop (subtle)
  const [activeMonth, setActiveMonth] = useState(5);
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActiveMonth((p) => (p + 1) % barData.length);
    }, 1400);
    return () => clearInterval(id);
  }, [reduceMotion, barData.length]);

  const wrap = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.06, when: "beforeChildren" },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  // “premium” chart entrance (no layout change)
  const chartIn = useMemo(
    () => ({
      hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
    }),
    []
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--main-bg)" }}>
      <motion.div variants={wrap} initial="hidden" animate="show" className="px-10 py-8 max-w-7xl mx-auto">
        {/* Top header */}
        <motion.div variants={item} className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <motion.div
                className="h-10 w-10 rounded-full flex items-center justify-center font-semibold"
                style={{ background: "var(--sidebar-bg)", color: "white" }}
                animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {userInitial}
              </motion.div>

              <div>
                <h1 className="text-[22px] font-bold" style={{ color: "var(--text-dark)" }}>
                  Dashboard
                </h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Welcome back, {userCity} ·{" "}
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} /> {new Date().toLocaleString('default', { month: 'long' })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
              <Link
                href="/ai-planner"
                className="px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                style={{
                  background: tint("--accent-blue", 0.18),
                  border: "1px solid var(--border)",
                  color: "var(--text-dark)",
                }}
              >
                <Sparkles size={16} />
                Ask AI
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
              <Link
                href="/settings"
                className="px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-dark)",
                }}
              >
                <Settings size={16} />
                Settings
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* KPI strip */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Monthly Leftover"
            value={inr(dashboardData?.monthlyLeftover || 0)}
            valueNumber={dashboardData?.monthlyLeftover || 0}
            valueKind="inr"
            sub={`Target: ₹${(userData?.currentSavings || 0).toLocaleString('en-IN')}/month`}
            icon={<Wallet size={18} />}
            badge={dashboardData?.monthlyLeftover! > 0 ? "Healthy" : "Low"}
            badgeTone={dashboardData?.monthlyLeftover! > 0 ? "green" : "blue"}
          />
          <MetricCard
            title="Savings Rate"
            value={`${Math.round((dashboardData?.savingsRate || 0) * 100)}%`}
            valueNumber={Math.round((dashboardData?.savingsRate || 0) * 100)}
            valueKind="percent"
            sub="Target: 30%+"
            icon={<TrendingUp size={18} />}
            badge={(dashboardData?.savingsRate || 0) >= 0.3 ? "On track" : "Needs work"}
            badgeTone={(dashboardData?.savingsRate || 0) >= 0.3 ? "blue" : "gold"}
          />
          <MetricCard
            title="Stress Score"
            value={dashboardData?.stressScore ? Math.round(dashboardData.stressScore) : 0}
            valueNumber={dashboardData?.stressScore ? Math.round(dashboardData.stressScore) : 0}
            valueKind="percent"
            sub={dashboardData?.stressScore! > 60 ? "⚠️ High risk" : "✓ Stable"}
            icon={<Brain size={18} />}
            badge={dashboardData?.stressScore! > 60 ? "Risky" : "Good"}
            badgeTone={dashboardData?.stressScore! > 60 ? "gold" : "green"}
          />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Future balance */}
          <motion.div variants={item} className="lg:col-span-8">
            <Panel
              title="Future Balance"
              right={
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(202,205,194,0.35)",
                    border: "1px solid var(--border)",
                    color: "var(--text-dark)",
                  }}
                >
                  6 months
                </span>
              }
            >
              <motion.div variants={chartIn} initial="hidden" animate="show" className="h-[260px] relative">
                {/* subtle animated shine overlay (does NOT change layout) */}
                {!reduceMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-[12px] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.35) 45%, transparent 70%)",
                      opacity: 0.25,
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
                    }}
                    animate={{ x: ["-40%", "120%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid rgb(202,205,194)",
                        background: "rgb(248,247,242)",
                        color: "rgb(44,44,43)",
                      }}
                    />
                    <Bar
                      dataKey="balance"
                      radius={[10, 10, 6, 6]}
                      animationDuration={reduceMotion ? 0 : 900}
                    >
                      {barData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === activeMonth ? "rgb(44,44,43)" : "rgba(44,44,43,0.55)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* micro annotation row */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStat label="Best month" value="Jun" icon={<TrendingUp size={14} />} />
                <MiniStat label="Growth" value="+150%" icon={<ArrowUpRight size={14} />} />
                <MiniStat label="Avg balance" value="₹33k" icon={<Wallet size={14} />} />
                <MiniStat label="Volatility" value="Low" icon={<TrendingDown size={14} />} />
              </div>
            </Panel>
          </motion.div>

          {/* Right rail */}
          <motion.div variants={item} className="lg:col-span-4 space-y-6">
            <Panel title="Try a Life Decision" subtitle="Run a quick scenario to see impact.">
              <Link href="/decision" className="block">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="rounded-2xl p-5 flex items-center justify-between"
                  style={{
                    background: "rgb(162,167,248)",
                    color: "rgb(44,44,43)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                  }}
                >
                  <div>
                    <div className="text-sm opacity-80">Simulate</div>
                    <div className="text-[20px] font-semibold leading-snug">Decision</div>
                  </div>

                  {/* tiny “nudge” animation on arrow */}
                  <motion.div
                    animate={reduceMotion ? undefined : { x: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronRight />
                  </motion.div>
                </motion.div>
              </Link>

              <div className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                Tip: compare “buy car” vs “move city” using saved decisions.
              </div>
            </Panel>

            <Panel title="AI Insight" subtitle="Personalized summary based on your trend.">
              <div className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {dashboardData?.stressScore! > 60
                  ? `Your stress score is high (${Math.round(dashboardData?.stressScore || 0)}). Consider reducing EMI or expenses to reach the "Low Stress" zone.`
                  : `You're in great shape! Your monthly leftover is ₹${(dashboardData?.monthlyLeftover || 0).toLocaleString('en-IN')}. If you add a new EMI, keep it under ₹${Math.round((dashboardData?.monthlyLeftover || 0) * 0.4).toLocaleString('en-IN')}/month.`}
              </div>

              <Link
                href="/ai-planner"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--text-dark)" }}
              >
                Ask AI Planner <ArrowUpRight size={16} />
              </Link>
            </Panel>
          </motion.div>

          {/* Lower row */}
          <motion.div variants={item} className="lg:col-span-4">
            <Panel title="Spending Split" subtitle="Where your money went this month.">
              <motion.div variants={chartIn} initial="hidden" animate="show" className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={82}
                      innerRadius={46}
                      // gentle spin-in (feels premium)
                      startAngle={reduceMotion ? 0 : 90}
                      endAngle={reduceMotion ? 360 : -270}
                      isAnimationActive={!reduceMotion}
                      animationDuration={950}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid rgb(202,205,194)",
                        background: "rgb(248,247,242)",
                        color: "rgb(44,44,43)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                {pieData.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span style={{ color: "var(--text-muted)" }}>
                      {p.name} <b style={{ color: "var(--text-dark)" }}>{p.value}%</b>
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-4">
            <Panel title="Financial Health Trend" subtitle="Confidence score over time.">
              <motion.div variants={chartIn} initial="hidden" animate="show" className="h-[220px]">
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis hide />
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
                      dataKey="score"
                      stroke="rgb(44,44,43)"
                      strokeWidth={3}
                      dot={false}
                      animationDuration={reduceMotion ? 0 : 900}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Current</span>
                <span className="font-semibold" style={{ color: "var(--text-dark)" }}>
                  78 / 100
                </span>
              </div>
            </Panel>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-4">
            <Panel title="Recent Activity" subtitle="Latest actions and reminders.">
              <motion.div
                initial={reduceMotion ? undefined : "hidden"}
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
                className="space-y-3"
              >
                <MotionWrap>
                  <ActivityRow icon={<CreditCard size={16} />} title="Rent paid" meta="₹12,000 · 2 days ago" />
                </MotionWrap>
                <MotionWrap>
                  <ActivityRow icon={<Wallet size={16} />} title="Savings added" meta="₹5,000 · 5 days ago" />
                </MotionWrap>
                <MotionWrap>
                  <ActivityRow icon={<Brain size={16} />} title="Simulation saved" meta="Car EMI scenario · 1 week ago" />
                </MotionWrap>
              </motion.div>

              <div className="mt-4">
                <Link
                  href="/simulate"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--text-dark)" }}
                >
                  Go to Simulations <ChevronRight size={16} />
                </Link>
              </div>
            </Panel>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- UI pieces ---------------- */

function MotionWrap({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      whileHover={reduceMotion ? undefined : { y: -1 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

function Panel({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-6"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="font-semibold" style={{ color: "var(--text-dark)", fontSize: 16 }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </div>
          )}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function MetricCard({
  title,
  value,
  valueNumber,
  valueKind,
  sub,
  icon,
  badge,
  badgeTone,
}: {
  title: string;
  value: string;
  valueNumber?: number;
  valueKind?: "inr" | "percent";
  sub: string;
  icon: React.ReactNode;
  badge: string;
  badgeTone: "green" | "blue" | "gold";
}) {
  const tone =
    badgeTone === "green"
      ? tint("--accent-green", 0.22)
      : badgeTone === "gold"
      ? tint("--accent-gold", 0.22)
      : tint("--accent-blue", 0.22);

  const reduceMotion = useReducedMotion();
  const n = typeof valueNumber === "number" ? useCountUp(valueNumber, 850) : null;

  const displayValue =
    n === null
      ? value
      : valueKind === "percent"
      ? `${n}%`
      : inr(n);

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.16 }}
      className="p-6"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          {title}
        </div>
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(202,205,194,0.35)", border: "1px solid var(--border)" }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 text-[24px] font-bold" style={{ color: "var(--text-dark)" }}>
        {displayValue}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          {sub}
        </div>

        {/* subtle live pulse on badge (premium) */}
        <motion.span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{ background: tone, border: "1px solid var(--border)", color: "var(--text-dark)" }}
          animate={reduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 0 6px rgba(162,167,248,0.0)", "0 0 0 rgba(0,0,0,0)"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {badge}
        </motion.span>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -1 }}
      transition={{ duration: 0.14 }}
      className="px-3 py-2 rounded-xl flex items-center justify-between gap-2"
      style={{
        background: "rgba(202,205,194,0.22)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
        <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>
          {value}
        </div>
      </div>
      <div style={{ color: "var(--text-muted)" }}>{icon}</div>
    </motion.div>
  );
}

function ActivityRow({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div
      className="flex items-center justify-between gap-3 p-3 rounded-xl"
      style={{
        background: "rgba(202,205,194,0.20)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>
            {title}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {meta}
          </div>
        </div>
      </div>
      <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
    </div>
  );
}
