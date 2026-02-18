"use client";
import { motion } from "framer-motion";

export default function FeatureCards() {
  return (
    <section className="px-8 py-24">
      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.25 }
          }
        }}
      >
        <Feature
          title="Scenario planning"
          desc="Explore big decisions with clear projections instead of guesswork."
          bg="var(--card-blue)"
        />
        <Feature
          title="Future balance"
          desc="See how your cash grows month by month with each choice."
          bg="var(--card-green)"
        />
        <Feature
          title="Stress & runway"
          desc="Understand risk and how long your savings can last."
          bg="var(--card-gold)"
        />
      </motion.div>
    </section>
  );
}

function Feature({ title, desc, bg }: { title: string; desc: string; bg: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.7 }}
      className="p-8 rounded-3xl hover:-translate-y-3"
      style={{
        backgroundColor: bg,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.05)"
      }}
    >
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-[var(--text-muted)]">{desc}</p>
    </motion.div>
  );
}
