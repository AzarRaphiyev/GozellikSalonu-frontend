"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Service } from "./types";
import { Clock, CreditCard, Loader2 } from "lucide-react";
import { api } from "@/lib/api"; // API yolunun düzgünlüyünü yoxlayın
import { useState, useEffect } from "react";

interface Step1ServiceProps {
    selectedService: Service | null;
    onSelect: (service: Service) => void;
}

export function Step1Service({ selectedService, onSelect }: Step1ServiceProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Backend-dən xidmətləri çəkirik
useEffect(() => {
    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get("/services");
            
            // DİQQƏT: Backend-dən gələn struktur 'response.data.data' şəklindədir
            if (response.data && Array.isArray(response.data.data)) {
                setServices(response.data.data);
            } else if (Array.isArray(response.data)) {
                setServices(response.data);
            }
            
            setError(null);
        } catch (err: any) {
            console.error("Xidmətlər yüklənmədi:", err);
            setError("Xidmətlər tapılmadı.");
        } finally {
            setLoading(false);
        }
    };
    fetchServices();
}, []);

    // Yüklənmə halı
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-foreground/60">Xidmətlər yüklənir...</p>
            </div>
        );
    }

    // Xəta halı
    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-primary-600 underline"
                >
                    Yenidən yoxla
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-foreground">Xidmət Seçimi</h2>
                <p className="text-sm text-foreground/60">Sizə uyğun olan xidməti seçin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(services) && services.length > 0 ? (
                    services.map((service) => {
                        const isSelected = selectedService?.id === service.id;
                        return (
                            <motion.div
                                key={service.id}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(service)}
                                className={`
                        relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-colors
                        ${isSelected
                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                                        : "border-border bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900"}
                    `}
                            >
                                <div className="flex flex-col gap-3">
                                    <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                                    <p className="text-xs text-foreground/70 min-h-[40px]">
                                        {service.description || "Bu xidmət haqqında ətraflı məlumat yoxdur."}
                                    </p>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/60">
                                        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{service.durationInMinutes || service.duration} dəq</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
                                            <CreditCard className="w-4 h-4" />
                                            <span>{service.price} ₼</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10 text-foreground/50 border-2 border-dashed rounded-xl">
                        {loading ? "Məlumatlar yüklənir..." : "Hələ ki, heç bir xidmət tapılmadı. Zəhmət olmasa bazanı doldurduğunuzdan əmin olun."}
                    </div>
                )}
            </div>
        </div>
    );
}