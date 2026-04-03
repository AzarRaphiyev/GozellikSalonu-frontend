"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationData } from "./types";
import { Step1Service } from "./Step1Service";
import { Step2Professional } from "./Step2Professional";
import { Step3DateTime } from "./Step3DateTime";
import { Step4Confirm } from "./Step4Confirm";
import { Button } from "../ui/Button";
import { api } from "@/lib/api"; // Backend-ə qoşulmaq üçün əlavə edildi
import { format } from "date-fns"; // Tarixi formatlamaq üçün əlavə edildi

const STEPS = [
    { id: 1, name: "Xidmət" },
    { id: 2, name: "Usta" },
    { id: 3, name: "Tarix və Saat" },
    { id: 4, name: "Təsdiq" },
];

export function ReservationWizard() {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const [reservation, setReservation] = React.useState<ReservationData>({
        service: null,
        professional: null,
        date: null,
        time: null,
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const updateReservation = <K extends keyof ReservationData>(key: K, value: ReservationData[K]) => {
        setReservation((prev) => ({ ...prev, [key]: value }));
    };

    // DÜZƏLİŞ: Real Backend-ə sorğu (POST /appointments)
    const handleConfirm = async () => {
        setIsSubmitting(true);
        
        try {
            if (!reservation.professional || !reservation.service || !reservation.date || !reservation.time) {
                throw new Error("Bütün məlumatlar tam doldurulmayıb.");
            }

            const formattedDate = format(reservation.date, 'yyyy-MM-dd');

            // Sizin yazdığınız NestJS backend API-na sorğu atırıq
            await api.post("/appointments", {
                workerId: reservation.professional.id,
                serviceId: reservation.service.id,
                date: formattedDate,
                startTime: reservation.time
            });

            setIsSuccess(true); // Uğurlu olduqda təbrik ekranı açılır
        } catch (error: any) {
            console.error("Rezervasiya xətası:", error);
            // Əgər istifadəçi giriş (login) etməyibsə və ya backend xəta verərsə ekranda göstər
            alert(error.message || "Rezervasiya zamanı xəta baş verdi. Zəhmət olmasa sistemə giriş etdiyinizdən əmin olun.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isNextDisabled = () => {
        switch (currentStep) {
            case 1:
                return !reservation.service;
            case 2:
                return !reservation.professional;
            case 3:
                return !reservation.date || !reservation.time;
            default:
                return false;
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-500">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
                    <svg className="h-10 w-10 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-foreground">Təbriklər!</h2>
                <p className="text-lg text-foreground/70 max-w-md">
                    Sizin rezervasiyanız uğurla qeydə alındı. Tezliklə təsdiq mesajı alacaqsınız.
                </p>
                <Button onClick={() => window.location.href = "/"} className="mt-4">
                    Ana səhifəyə qayıt
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            {/* Stepper Header */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800" />
                    <div
                        className="absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-primary-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                <div
                                    className={`
                                        flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300
                                        ${isActive ? 'border-primary-500 bg-background text-primary-600 dark:text-primary-500' : ''}
                                        ${isCompleted ? 'border-primary-500 bg-primary-500 text-white' : ''}
                                        ${!isActive && !isCompleted ? 'border-zinc-200 bg-background text-zinc-400 dark:border-zinc-800' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span className={`text-xs font-medium md:text-sm absolute -bottom-6 whitespace-nowrap ${isActive || isCompleted ? 'text-foreground' : 'text-foreground/40'}`}>
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px] py-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && (
                            <Step1Service
                                selectedService={reservation.service}
                                onSelect={(s) => updateReservation("service", s)}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Professional
                                selectedProfessional={reservation.professional}
                                onSelect={(p) => updateReservation("professional", p)}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3DateTime
                                selectedProfessional={reservation.professional} // DÜZƏLİŞ: Bu sətir əlavə edildi
                                selectedDate={reservation.date}
                                selectedTime={reservation.time}
                                onSelectDate={(d) => updateReservation("date", d)}
                                onSelectTime={(t) => updateReservation("time", t)}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Confirm
                                data={reservation}
                                onConfirm={handleConfirm}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className={currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}
                >
                    Geri
                </Button>

                {currentStep < 4 && (
                    <Button
                        onClick={nextStep}
                        disabled={isNextDisabled()}
                    >
                        Növbəti addım
                    </Button>
                )}
            </div>
        </div>
    );
}