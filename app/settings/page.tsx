"use client";

import { useEffect, useState } from "react";

type SettingsState = {
  profileName: string;
  city: string;
  currency: "INR" | "USD";
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  notifications: boolean;
  autoSaveDecisions: boolean;
  darkMode: boolean;
};

const STORAGE_KEY = "fintwin-settings";

export default function SettingsPage() {
  const [savedMsg, setSavedMsg] = useState("");
  const [settings, setSettings] = useState<SettingsState>({
    profileName: "Amna",
    city: "Delhi",
    currency: "INR",
    monthlyIncome: 30000,
    monthlyExpenses: 15000,
    savingsGoal: 500000,
    notifications: true,
    autoSaveDecisions: true,
    darkMode: false,
  });

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSettings(JSON.parse(raw));
      } catch {
        // ignore corrupted storage
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 1200);
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const symbol = settings.currency === "INR" ? "₹" : "$";

  return (
    <div className="p-10 min-h-screen" style={{ background: "var(--main-bg)" }}>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6 }}>
              Update your profile + financial defaults used in simulations and AI planner.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMsg && (
              <span
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(124,189,140,0.15)",
                  border: "1px solid var(--border)",
                  color: "var(--text-dark)",
                }}
              >
                {savedMsg}
              </span>
            )}

            <button
              onClick={saveSettings}
              className="px-5 py-2 rounded-lg font-semibold"
              style={{ background: "var(--accent-blue)", color: "white" }}
            >
              Save
            </button>

            <button
              onClick={resetSettings}
              className="px-5 py-2 rounded-lg font-semibold"
              style={{ background: "transparent", border: "1px solid var(--border)" }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile */}
          <div className="card">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Profile</h2>

            <Field label="Name">
              <input
                className="w-full p-2 rounded border"
                value={settings.profileName}
                onChange={(e) => setSettings({ ...settings, profileName: e.target.value })}
              />
            </Field>

            <Field label="City">
              <input
                className="w-full p-2 rounded border"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              />
            </Field>

            <Field label="Currency">
              <select
                className="w-full p-2 rounded border"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value as any })}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </Field>
          </div>

          {/* Financial Defaults */}
          <div className="card">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Financial Defaults</h2>

            <Field label="Monthly Income">
              <input
                type="number"
                className="w-full p-2 rounded border"
                value={settings.monthlyIncome}
                onChange={(e) => setSettings({ ...settings, monthlyIncome: Number(e.target.value) })}
              />
            </Field>

            <Field label="Monthly Expenses">
              <input
                type="number"
                className="w-full p-2 rounded border"
                value={settings.monthlyExpenses}
                onChange={(e) =>
                  setSettings({ ...settings, monthlyExpenses: Number(e.target.value) })
                }
              />
            </Field>

            <Field label="Savings Goal">
              <input
                type="number"
                className="w-full p-2 rounded border"
                value={settings.savingsGoal}
                onChange={(e) => setSettings({ ...settings, savingsGoal: Number(e.target.value) })}
              />
            </Field>

            <div
              className="mt-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Preview: Goal = <b>{symbol}{settings.savingsGoal.toLocaleString()}</b>
            </div>
          </div>

          {/* Preferences */}
          <div className="card md:col-span-2">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Preferences</h2>

            <ToggleRow
              title="Notifications"
              subtitle="Show reminders and insights."
              checked={settings.notifications}
              onChange={(v) => setSettings({ ...settings, notifications: v })}
            />

            <Divider />

            <ToggleRow
              title="Auto-save decisions"
              subtitle="Save simulations automatically after you run them."
              checked={settings.autoSaveDecisions}
              onChange={(v) => setSettings({ ...settings, autoSaveDecisions: v })}
            />

            <Divider />

            <ToggleRow
              title="Dark mode (UI)"
              subtitle="Optional theme toggle for the AI Planner."
              checked={settings.darkMode}
              onChange={(v) => setSettings({ ...settings, darkMode: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-4" style={{ borderTop: "1px solid var(--border)" }} />;
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </div>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className="px-4 py-2 rounded-lg text-sm font-semibold"
        style={{
          background: checked ? "rgba(124,189,140,0.25)" : "transparent",
          border: "1px solid var(--border)",
        }}
      >
        {checked ? "On" : "Off"}
      </button>
    </div>
  );
}
