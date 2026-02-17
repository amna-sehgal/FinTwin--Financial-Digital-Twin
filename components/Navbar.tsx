export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center px-10 py-5"
      style={{
        background: "var(--sidebar-bg)",
        color: "white"
      }}
    >
      <h1 className="font-bold text-lg tracking-wide">
        FinTwin
      </h1>

      <button
        className="px-6 py-3 rounded-xl font-semibold hover:scale-105"
        style={{
          background: "var(--accent-blue)",
          color: "#fff",
          boxShadow: "0 8px 25px rgba(162,167,248,0.5)"
        }}
      >
        Start Simulation
      </button>
    </nav>
  );
}



