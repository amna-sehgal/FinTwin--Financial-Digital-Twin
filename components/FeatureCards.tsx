export default function FeatureCards() {
    return (
        <section className="px-8 py-16">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Feature
                    title="Simulate Life Decisions"
                    desc="Test decisions like buying a car, moving city, or switching jobs."
                />
                <Feature
                    title="Predict Future Balance"
                    desc="See how your bank balance changes over the next 12 months."
                />
                <Feature
                    title="Financial Stress Score"
                    desc="Understand risk before making big financial choices."
                />
            </div>
        </section>
    );
}

function Feature({ title, desc }: any) {
    return (
        <div
            className="p-8 rounded-2xl backdrop-blur-sm hover:-translate-y-1"
            style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}
        >

            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-500">{desc}</p>
        </div>
    );
}

