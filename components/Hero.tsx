"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="text-center pt-28 pb-24 px-6">

            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl font-bold max-w-3xl mx-auto leading-tight"
            >
                Plan big moves with confidence
                <span className="block mt-2">
                    before they cost you money
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-6 text-lg max-w-xl mx-auto text-[var(--text-muted)]"
            >
                Try out decisions like a new city, a big purchase, or a job change.
                See the impact on your runway, savings, and peace of mind.
            </motion.p>

            <Link href="/signup">
                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-10 btn btn-primary hover:scale-105"
                    style={{
                        boxShadow: "0 15px 40px rgba(162,167,248,0.4)"
                    }}
                >
                    Start planning
                </motion.button>
            </Link>

        </section>
    );
}

