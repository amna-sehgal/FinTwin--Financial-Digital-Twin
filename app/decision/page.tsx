export default function DecisionPage() {
  return (
    <div className="p-10 min-h-screen" style={{ background: "var(--main-bg)" }}>
      <h1 className="text-2xl font-bold mb-6">
        Simulate a Life Decision
      </h1>

      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        Choose a decision to simulate:
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <DecisionCard title="Buy a Car" />
        <DecisionCard title="Switch Job" />
        <DecisionCard title="Take a Loan" />

      </div>
    </div>
  );
}

function DecisionCard({ title }: { title: string }) {
  return (
    <div
      className="p-6 rounded-2xl cursor-pointer"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
      }}
    >
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}
