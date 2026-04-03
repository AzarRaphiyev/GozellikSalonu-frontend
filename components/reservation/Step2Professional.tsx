"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Professional } from "./types";
import { UserCircle, Loader2, Star } from "lucide-react";
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
                
                // Məlumatın nə formatda gəldiyini görmək üçün Konsola çıxarırıq (F12 basıb baxa bilərsiniz)
                console.log("Backend-dən gələn usta məlumatı:", response);
                
                let providersList: Professional[] = [];

                // Formatları tək-tək yoxlayırıq:
                if (response && Array.isArray(response.data)) {
                    // NestJS Pagination formatı: { data: [...], total: ... }
                    providersList = response.data;
                } else if (response && response.data && Array.isArray(response.data.data)) {
                    // Axios formatı: { data: { data: [...] } }
                    providersList = response.data.data;
                } else if (Array.isArray(response)) {
                    // Birbaşa massiv formatı: [...]
                    providersList = response;
                }

                console.log("Siyahıya əlavə ediləcək ustalar:", providersList);
                
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map((prof) => {
                    const isSelected = selectedProfessional?.id === prof.id;
                    
                    return (
                        <motion.div
                            key={prof.id}
                            whileHover={{ y: -5, borderColor: "rgba(234, 179, 8, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(prof)}
                            className={`
                                relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                                ${isSelected 
                                    ? "bg-primary-50 dark:bg-primary-500/10 border-primary-500 shadow-[0_0_20px_rgba(234,179,8,0.15)]" 
                                    : "bg-background border-border/60 hover:bg-zinc-50 dark:hover:bg-white/[0.03]"}
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4">
                                    <div className="bg-primary-500 rounded-full p-1">
                                        <Star className="w-3 h-3 text-white dark:text-black fill-current" />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border/40 overflow-hidden flex-shrink-0">
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
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-lg text-foreground leading-tight">
                                        {prof.name}
                                    </h3>
                                    <p className="text-sm text-primary-600 dark:text-primary-500 font-medium">
                                        {prof.title || "Usta"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-foreground/50 tracking-wider">Təcrübə</span>
                                    <span className="text-xs font-medium text-foreground/80">Peşəkar</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase text-foreground/50 tracking-wider">Status</span>
                                    <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1 justify-end font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Aktiv
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}