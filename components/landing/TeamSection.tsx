"use client";

import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

const team = [
    { name: "Aysel Məmmədova", role: "Top Kolorist", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop" },
    { name: "Tahirə Hüseynova", role: "Nail Art Ustası", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop" },
    { name: "Leyla Abdullayeva", role: "Kosmetoloq", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1364&auto=format&fit=crop" },
    { name: "Günel Qasımova", role: "Vizajist", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1286&auto=format&fit=crop" },
];

export function TeamSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center">
                        Mütəxəssislərimiz
                    </h2>
                    <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                        Sizin gözəlliyinizi əmanət etdiyiniz peşəkar komanda
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-border"
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                {member.img ? (
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                                        <UserCircle className="w-24 h-24 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-left">
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-sm font-medium text-primary-400 mt-1">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
