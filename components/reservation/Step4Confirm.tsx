"use client";

import * as React from "react";
import { ReservationData } from "./types";
import { Calendar, Clock, Scissors, UserCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface Step4ConfirmProps {
    data: ReservationData;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export function Step4Confirm({ data, onConfirm, isSubmitting }: Step4ConfirmProps) {
    const { service, professional, date, time } = data;

    if (!service || !professional || !date || !time) {
        return (
            <div className="py-12 text-center text-foreground/60">
                Məlumatlar tam deyil. Lütfən əvvəlki addımları tamamlayın.
            </div>
        );
    }

    const formattedDate = date.toLocaleDateString("az-AZ", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex flex-col gap-8 max-w-xl mx-auto">
            <div className="flex flex-col gap-2 text-center">
                <h2 className="text-2xl font-bold text-foreground">Təsdiq</h2>
                <p className="text-sm text-foreground/60">
                    Rezervasiya detallarınızı yoxlayın və təsdiq edin.
                </p>
            </div>

            <div className="flex flex-col gap-0 rounded-2xl border border-border/60 bg-background shadow-xs overflow-hidden">
                {/* Service Info */}
                <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-border/40">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500">
                        <Scissors className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-sm font-medium text-foreground/50 uppercase tracking-wider">Xidmət</span>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                            <span className="font-bold text-lg text-primary-600 dark:text-primary-500">{service.price}</span>
                        </div>
                        <p className="text-sm text-foreground/70">{service.duration}</p>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                        {professional.imageUrl ? (
                            <img src={professional.imageUrl} alt={professional.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <UserCircle className="h-8 w-8 text-zinc-500" />
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground/50 uppercase tracking-wider">Usta</span>
                        <h3 className="text-base font-medium text-foreground">{professional.name}</h3>
                        <p className="text-sm text-foreground/60 text-primary-600/80">{professional.specialty}</p>
                    </div>
                </div>

                {/* Date & Time Info */}
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex flex-1 items-center gap-3 p-5 sm:p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground/50 uppercase tracking-wider">Tarix</span>
                            <p className="text-sm font-medium text-foreground">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="flex sm:w-1/3 items-center gap-3 p-5 sm:p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground/50 uppercase tracking-wider">Saat</span>
                            <p className="text-base font-bold text-foreground">{time}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px]"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Gözləyin..." : "Təsdiqlə"}
                </Button>
            </div>
        </div>
    );
}
