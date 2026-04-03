"use client";

import { motion } from "framer-motion";

const images = [
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a1fbbfc614cc?q=80&w=2666&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=2600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop",
];

export function CinematicGallery() {
    return (
        <section className="relative py-24 bg-[#0a0505] overflow-hidden">
            {/* Film Grain Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Neon Glow Accents */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] mix-blend-screen" />

            <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-widest text-[#f5ebd9] uppercase sm:text-4xl drop-shadow-[0_0_15px_rgba(255,100,100,0.3)]">
                        Hisslərin Güzgüsü
                    </h2>
                    <p className="mt-4 text-sm tracking-widest text-[#d4bca3]/80 uppercase mx-auto">
                        Gözəlliyin Sinematik Anları
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                            className="relative group overflow-hidden rounded-sm break-inside-avoid border border-[#3a1c1c]/50 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                        >
                            {/* Warm Color Overlay */}
                            <div className="absolute inset-0 bg-[#3a1a00]/20 mix-blend-color z-10 group-hover:bg-transparent transition-colors duration-700" />

                            <img
                                src={src}
                                alt="Salon Work"
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105 filter contrast-125 saturate-150 brightness-90"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
