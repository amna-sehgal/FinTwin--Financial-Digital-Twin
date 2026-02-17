"use client";

import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Sparkles,
  Settings,
  Wallet,
  TrendingUp,
  Brain
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {

  const barData = [
    { month: "Jan", balance: 20000 },
    { month: "Feb", balance: 24000 },
    { month: "Mar", balance: 30000 },
    { month: "Apr", balance: 36000 },
    { month: "May", balance: 42000 },
    { month: "Jun", balance: 50000 },
  ];

  const pieData = [
    { name: "Savings", value: 40 },
    { name: "Expenses", value: 35 },
    { name: "Rent", value: 25 },
  ];

  const COLORS = [
    "var(--accent-green)",
    "var(--accent-blue)",
    "var(--accent-gold)"
  ];

  return (
    <div className="min-h-screen flex">

      {/* SIDEBAR */}
      <div
        className="w-64 p-6 hidden lg:flex flex-col justify-between"
        style={{ background: "var(--sidebar-bg)", color: "white" }}
      >
        <div>
          <h1 className="text-xl font-semibold mb-2">FinTwin</h1>
          <p className="text-sm opacity-70 mb-10">Welcome back, Amna</p>

          <div className="space-y-6">
            <SideItem icon={<Home size={18}/>} label="Dashboard" active/>
            <SideItem icon={<BarChart3 size={18}/>} label="Simulations"/>
            <SideItem icon={<Sparkles size={18}/>} label="AI Planner"/>
            <SideItem icon={<Settings size={18}/>} label="Settings"/>
          </div>
        </div>

        <div className="text-xs opacity-60">
          v1.0 preview
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Stat title="Monthly Leftover" value="₹18,000" icon={<Wallet size={18}/>} color="var(--card-blue)" />
          <Stat title="Savings Rate" value="32%" icon={<TrendingUp size={18}/>} color="var(--card-green)" />
          <Stat title="Stress Score" value="Low" icon={<Brain size={18}/>} color="var(--card-gold)" />
          <Stat title="Freedom Years" value="7.5 yrs" icon={<Sparkles size={18}/>} color="var(--card-blue)" />
        </div>

        {/* GRAPH */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="p-6 rounded-3xl border mb-8"
          style={{
            background: "rgba(255,255,255,0.6)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="mb-4 font-semibold">Future Balance</h2>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <Tooltip />

                <Bar
                  dataKey="balance"
                  fill="rgb(44,44,43)"
                  radius={[8,8,0,0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BOTTOM */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* PIE */}
          <Card>
            <h3 className="mb-4 font-semibold">Spending Split</h3>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={80}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* BUTTON */}
          <Card className="flex flex-col items-center justify-center">
            <h3 className="mb-4 font-semibold">Try a Life Decision</h3>

            <motion.button
              whileHover={{ scale:1.05 }}
              whileTap={{ scale:0.95 }}
              className="px-6 py-4 rounded-xl font-medium shadow-md"
              style={{
                background: "var(--accent-blue)",
                color: "var(--text-dark)",
              }}
            >
              Simulate Decision
            </motion.button>
          </Card>

          {/* AI */}
          <Card>
            <h3 className="mb-3 font-semibold">AI Insight</h3>

            <p className="text-sm text-[var(--text-muted)]">
              You are financially stable, but buying a car will increase your
              monthly stress by 18%.
            </p>
          </Card>

        </div>
      </div>
    </div>
  );
}

function SideItem({ icon, label, active }: any) {
  return (
    <div
      className={`
      flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
      transition-all
      ${active ? "bg-white/10" : "hover:bg-white/10"}
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Stat({ title, value, icon, color }: any) {
  return (
    <motion.div
      whileHover={{ y:-4 }}
      className="p-6 rounded-3xl border"
      style={{
        background: color,
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{title}</p>
        {icon}
      </div>

      <p className="text-2xl font-semibold mt-3">{value}</p>
    </motion.div>
  );
}

function Card({ children, className="" }: any) {
  return (
    <motion.div
      whileHover={{ y:-4 }}
      className={`p-6 rounded-3xl border ${className}`}
      style={{
        background: "rgba(255,255,255,0.6)",
        borderColor: "var(--border)",
      }}
    >
      {children}
    </motion.div>
  );
}
