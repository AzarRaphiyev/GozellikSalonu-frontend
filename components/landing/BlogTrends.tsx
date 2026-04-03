"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function BlogTrends() {
    const posts = [
        {
            title: "2026-cı ilin Ən Trend Saç Rəngləri",
            date: "12 Mart 2026",
            category: "Hair",
            img: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=2600&auto=format&fit=crop"
        },
        {
            title: "Üz Dərisinə Düzgün Qulluq Sirri",
            date: "05 Mart 2026",
            category: "Skin Care",
            img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: "Mükəmməl Gəlin Makiyajı Necə Olmalıdır?",
            date: "28 Fevral 2026",
            category: "Makeup",
            img: "https://images.unsplash.com/photo-1512496015851-a1fbbfc614cc?q=80&w=2666&auto=format&fit=crop"
        },
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Gözəllik Bloqu
                        </h2>
                        <p className="mt-4 text-lg text-foreground/60 max-w-xl">
                            Mütəxəssislərimizdən ən son trendlər və qulluq məsləhətləri.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-semibold hover:underline group">
                        Hamısını oxu <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-border hover:border-primary-500/50 transition-colors"
                        >
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4 text-xs font-medium uppercase tracking-wider">
                                    <span className="text-primary-600 dark:text-primary-500">{post.category}</span>
                                    <span className="text-foreground/40">{post.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {post.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
