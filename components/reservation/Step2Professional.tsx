"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Professional } from "./types";
import { UserCircle, Loader2, Star, Award, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

interface Step2ProfessionalProps {
    selectedProfessional: Professional | null;
    onSelect: (prof: Professional) => void;
}

export function Step2Professional({ selectedProfessional, onSelect }: Step2ProfessionalProps) {
    const [providers, setProviders] = useState<Professional[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true);
                const response = await api.get("/providers");

                let providersList: any[] = [];

                if (response && Array.isArray(response.data)) {
                    providersList = response.data;
                } else if (response && response.data && Array.isArray(response.data.data)) {
                    providersList = response.data.data;
                } else if (Array.isArray(response)) {
                    providersList = response;
                }

                // Average Rating-ə görə çoxdan aza doğru sıralayırıq
                providersList.sort((a, b) => {
                    const ratingA = a.averageRating ? Number(a.averageRating) : 0;
                    const ratingB = b.averageRating ? Number(b.averageRating) : 0;
                    return ratingB - ratingA;
                });

                if (providersList.length === 0) {
                    setError("Bazada heç bir usta tapılmadı. Zəhmət olmasa Swagger-dən 'seed' edin.");
                } else {
                    setProviders(providersList);
                    setError(null);
                }

            } catch (err: any) {
                console.error("Ustalar yüklənmədi:", err);
                setError("Ustaların siyahısını yükləmək mümkün olmadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-zinc-500">Peşəkarlar axtarılır...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-red-500/20 rounded-2xl">
                <p className="text-red-500 font-medium text-center px-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground">Usta Seçimi</h2>
                <p className="text-sm text-foreground/60">Sizə xidmət göstərəcək mütəxəssisi seçin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {providers.map((prof: any, index: number) => {
                    const isSelected = selectedProfessional?.id === prof.id;
                    const rating = prof.averageRating ? Number(prof.averageRating) : 0;
                    const isTopRated = index === 0 && rating > 0;

                    return (
                        <motion.div
                            key={prof.id}
                            whileHover={{ y: -6, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(prof as Professional)}
                            className={`
                                relative flex flex-col p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl group
                                ${isSelected
                                    ? "bg-primary-50 dark:bg-primary-500/10 border-primary-500 shadow-[0_0_25px_rgba(234,179,8,0.2)]"
                                    : "bg-background/80 border-border/60 hover:shadow-xl hover:border-white/20 dark:hover:bg-white/[0.04]"}
                            `}
                        >
                            {/* Antigravity glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Top Rated Badge */}
                            {isTopRated && (
                                <div className="absolute top-0 right-0 z-20">
                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 rounded-bl-3xl rounded-tr-[2rem] text-[10px] font-black text-black uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center gap-1.5 border-b border-l border-amber-300/50">
                                        <Award className="w-3.5 h-3.5" /> Top Rated
                                    </div>
                                </div>
                            )}

                            {isSelected && !isTopRated && (
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-primary-500 rounded-full p-1.5 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                                        <Check className="w-3.5 h-3.5 text-white dark:text-black" />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4 relative z-10 w-full">
                                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border-[3px] border-white dark:border-zinc-700/50 overflow-hidden flex-shrink-0 shadow-inner group-hover:border-primary-200 dark:group-hover:border-primary-500/30 transition-colors">
                                    {prof.profileImageUrl ? (
                                        <img
                                            src={prof.profileImageUrl.startsWith('http') ? prof.profileImageUrl : `http://localhost:3001/${prof.profileImageUrl}`}
                                            alt={prof.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <UserCircle className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 min-w-0 pr-8">
                                    <h3 className="font-bold text-lg text-foreground leading-tight truncate">
                                        {prof.name}
                                    </h3>
                                    <p className="text-[11px] text-primary-600 dark:text-primary-500 font-bold tracking-widest uppercase mt-1 opacity-80">
                                        {prof.title || "Usta"}
                                    </p>

                                    {/* Rating Display */}
                                    <div className="flex items-center gap-1.5 mt-2.5">
                                        <Star className={`w-4 h-4 ${rating > 0 ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" : "text-zinc-300 dark:text-zinc-600"}`} />
                                        <span className={`text-[13px] font-black ${rating > 0 ? "text-yellow-600 dark:text-yellow-500" : "text-zinc-400 dark:text-zinc-500"}`}>
                                            {rating > 0 ? rating.toFixed(1) : "New"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}