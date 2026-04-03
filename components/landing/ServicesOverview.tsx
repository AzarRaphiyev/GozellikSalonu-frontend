"use client";

import { motion } from "framer-motion";

const services = [
    { name: "Saç Kəsimi və Ukladka", price: "30 ₼-dan" },
    { name: "Gündəlik və Ziyafət Makiyajı", price: "50 ₼-dan" },
    { name: "Aparat Manikürü & Gel Lak", price: "35 ₼-dan" },
    { name: "Kompleks Üz Təmizlənməsi", price: "80 ₼-dan" },
    { name: "Gəlin Paketi (Saç + Makiyaj)", price: "250 ₼-dan" },
    { name: "Saçların Peşəkar Boyanması", price: "70 ₼-dan" },
];

export function ServicesOverview() {
    return (
        <section id="xidmetler" className="py-24 bg-zinc-50 dark:bg-zinc-950/50 w-full border-y border-border/40">
            <div className="container mx-auto px-4 max-w-4xl sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Populyar Xidmətlərimiz
                    </h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full" />
                </div>

                <div className="space-y-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group flex flex-col sm:flex-row items-baseline justify-between py-4 border-b border-border/60 hover:border-primary-500/50 transition-colors"
                        >
                            <h3 className="text-xl font-medium text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {service.name}
                            </h3>
                            <div className="hidden sm:block flex-1 border-b-2 border-dotted border-border/40 mx-6 opacity-30" />
                            <span className="text-lg font-bold text-foreground mt-2 sm:mt-0 whitespace-nowrap">
                                {service.price}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
