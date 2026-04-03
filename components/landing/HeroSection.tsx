"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden w-full">
            {/* Background Video/Image Placeholder */}
            <div className="absolute inset-0 -z-20 bg-zinc-900">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop"
                    alt="Salon Background"
                    className="w-full h-full object-cover opacity-70"
                />
            </div>

            <div className="container relative z-20 flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center max-w-4xl"
                >
                    <span className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-md">
                        Özəl Təcrübə, Əsl Gözəllik
                    </span>
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl drop-shadow-xl">
                        Sizin <span className="text-primary-400">Gözəlliyiniz</span> Bizi İlhamlandırır.
                    </h1>
                    <p className="mt-8 text-xl text-white/90 sm:text-2xl max-w-2xl leading-relaxed drop-shadow-md font-medium">
                        Şəhərin ən prestijli salonunda, peşəkar ustalarımızın təqdim etdiyi eksklüziv xidmətlərlə fərq yaradın.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                        <Link href="/rezervasiya">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl transition-all hover:scale-105">
                                İndi Rezerv Et
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
