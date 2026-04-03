"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    { name: "Səbinə Rəhimova", role: "VİP Müştəri", text: "Salonun atmosferi mükəmməldir. Ustalara güvənim tamdır." },
    { name: "Nərmin Əliyeva", role: "Gəlin", text: "Ən xoşbəxt günümü bu salona əmanət etdim və heç peşman olmadım." },
    { name: "Leyla Kərimova", role: "Daimi Müştəri", text: "Kosmetologiya xidmətləri möhtəşəmdir. Dərim göz qabağındadır." },
    { name: "Könül Quliyeva", role: "Müştəri", text: "Müştəri məmnuniyyəti həqiqətən ön plandadır. Çox sağ olun." },
    { name: "Aytən Həsənova", role: "VİP Müştəri", text: "Saç boyamasında Aysel xanıma ancaq bu salonu güvənirəm." },
];

export function TestimonialsMarquee() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50 w-full overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl sm:px-6 lg:px-8 mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center">
                    Müştərilərimiz Nə Deyir?
                </h2>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                {/* Left/Right Fading Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10" />

                <div className="group flex overflow-hidden p-2 gap-6 w-full">
                    <motion.div
                        className="flex shrink-0 gap-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                    >
                        {[...testimonials, ...testimonials].map((t, idx) => (
                            <div
                                key={idx}
                                className="w-[350px] shrink-0 rounded-2xl border border-border bg-white dark:bg-background/80 p-8 shadow-sm backdrop-blur-md"
                            >
                                <div className="flex text-yellow-500 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                                <p className="text-foreground/80 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-foreground">{t.name}</h4>
                                    <span className="text-sm text-primary-600 dark:text-primary-500">{t.role}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
