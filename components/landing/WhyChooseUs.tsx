"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Crown, Heart } from "lucide-react";

export function WhyChooseUs() {
    const features = [
        {
            icon: <Sparkles size={40} className="text-primary-500" />,
            title: "Premium Kosmetika",
            desc: "Yalnız ən yüksək keyfiyyətli, dünyaca məşhur brendlərdən istifadə edirik.",
        },
        {
            icon: <Users size={40} className="text-primary-500" />,
            title: "Peşəkar Masterlər",
            desc: "İllərin təcrübəsinə malik, mütəmadi təlim keçən ekspert komanda.",
        },
        {
            icon: <Crown size={40} className="text-primary-500" />,
            title: "VİP Xidmət",
            desc: "Hər bir müştəriyə fərdi yanaşma və özəl atmosfer təqdim edilir.",
        },
        {
            icon: <Heart size={40} className="text-primary-500" />,
            title: "Gigiyena",
            desc: "Bütün alətlər beynəlxalq standartlara uyğun sterilizasiya olunur.",
        },
    ];

    return (
        <section className="py-24 bg-background w-full">
            <div className="container mx-auto px-4 max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Niyə Bizi Seçməlisiniz?
                    </h2>
                    <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                        Hər detala diqqət yetirərək, mükəmməl xidmət üçün çalışırıq.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-zinc-50 dark:bg-zinc-900/50 hover:border-primary-500/50 transition-colors"
                        >
                            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-950/30 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-foreground/70 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
