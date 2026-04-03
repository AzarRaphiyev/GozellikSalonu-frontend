"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        q: "Rezervasiyanı necə ləğv edə bilərəm?",
        a: "Rezervasiya tarixindən ən azı 24 saat öncə bizimlə əlaqə saxlayaraq (telefon və ya email vasitəsilə) ödənişsiz şəkildə ləğv edə bilərsiniz.",
    },
    {
        q: "Gəlin paketinə hansı xidmətlər daxildir?",
        a: "Gəlin profilinə sınaq kosmetologiyası, sınaq saç ustası görüşü, əsas gün üçün saç, VİP makiyaj və geyinməyə kömək daxildir.",
    },
    {
        q: "Hansı brend kosmetikadan istifadə edirsiniz?",
        a: "Yalnız qlobal lüks seqmentdə tanınan Tom Ford, Charlotte Tilbury, Dior və peşəkar vasitələrdən (Oribe, Kevin Murphy) istifadə edirik.",
    },
    {
        q: "Hədiyyə kartları təklif edirsiniz?",
        a: "Bəli, istənilən məbləğdə fiziki və ya elektron hədiyyə kartlarımız mövcuddur. Salonumuzdan əldə edə bilərsiniz.",
    },
];

export function FaqAccordion() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section id="faq" className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="container mx-auto px-4 max-w-3xl sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Tez-tez Verilən Suallar
                    </h2>
                    <p className="mt-4 text-lg text-foreground/60">
                        Sizi maraqlandıra biləcək detallar
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <motion.div
                                key={idx}
                                initial={false}
                                className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? 'border-primary-500/50 bg-background shadow-xs' : 'border-border bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
                            >
                                <button
                                    className="flex w-full items-center justify-between p-6 text-left"
                                    onClick={() => toggle(idx)}
                                >
                                    <span className="text-lg font-semibold text-foreground pr-8">
                                        {faq.q}
                                    </span>
                                    <div className={`flex shrink-0 items-center justify-center rounded-full p-2 transition-colors ${isOpen ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial="collapsed"
                                            animate="open"
                                            exit="collapsed"
                                            variants={{
                                                open: { opacity: 1, height: "auto", marginBottom: 24 },
                                                collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                                            }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="px-6"
                                        >
                                            <p className="text-foreground/70 leading-relaxed border-t border-border/40 pt-4">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
