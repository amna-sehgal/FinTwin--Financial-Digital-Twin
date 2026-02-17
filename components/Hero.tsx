export default function Hero() {
    return (
        <section className="text-center py-24 px-6">
            <h1 className="text-5xl font-bold max-w-3xl mx-auto leading-tight">
                Test your life decisions before they cost you money.
            </h1>

            <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
                Simulate financial choices like buying a car, moving cities, or
                changing jobs — and see their future impact instantly.
            </p>

            <button
                className="mt-8 px-8 py-4 rounded-xl font-semibold hover:scale-105"
                style={{
                    background: "var(--accent-blue)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }}
            >
                Start Simulation
            </button>

        </section>
    );
}

