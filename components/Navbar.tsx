export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5">
      <h1 className="font-bold text-lg">FinTwin</h1>

      <button
        className="px-5 py-2 rounded-lg"
        style={{ background: "var(--accent-blue)" }}
      >
        Start Simulation
      </button>
    </nav>
  );
}

