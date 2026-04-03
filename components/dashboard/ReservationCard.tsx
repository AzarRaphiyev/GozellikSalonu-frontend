"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle, Clock4, Scissors, Check, X, Star, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Appointment = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    service: { name: string; price: number };
    worker?: { name: string, email?: string };
    customer?: { name: string, email?: string };
    provider?: { name: string, title?: string };
};

interface ReservationCardProps {
    app: Appointment;
    role: string | null;
    targetName: string;
    targetInitial: string;
    personLabel: string;
    onStatusChange?: (id: number, newStatus: string) => void;
}

export function ReservationCard({ app, role, targetName, targetInitial, personLabel, onStatusChange }: ReservationCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Review Feature States
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const safeStatus = (app.status || '').toUpperCase();
    const isPending = safeStatus === 'PENDING';

    const handleComplete = async () => {
        setIsCompleting(true);
        // Simulate micro-interaction time
        setTimeout(async () => {
            try {
                await api.patch(`/appointments/${app.id}/status`, { status: "COMPLETED" });
                if (onStatusChange) onStatusChange(app.id, "COMPLETED");
            } catch (error) {
                console.error("Xəta baş verdi:", error);
            } finally {
                setIsCompleting(false);
            }
        }, 600); // Wait for animation
    };

    const handleCancel = async () => {
        try {
            await api.patch(`/appointments/${app.id}/status`, { status: "CANCELED" });
            if (onStatusChange) onStatusChange(app.id, "CANCELED");
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Xəta", { description: "Zəhmət olmasa ulduzlarla qiymətləndirin." });
            return;
        }

        setIsSubmittingReview(true);
        try {
            await api.post('/reviews', {
                appointmentId: app.id,
                rating,
                comment: reviewComment,
            });
            toast.success("Uğurlu", { description: "Rəyiniz üçün təşəkkür edirik!" });
            setHasReviewed(true);
            setIsReviewModalOpen(false);
        } catch (error: any) {
            toast.error("Xəta", { description: error.response?.data?.message || "Rəy göndərilərkən xəta baş verdi." });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'CONFIRMED':
                return <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"><Clock4 className="w-3.5 h-3.5" /> Gözləyir</span>;
            case 'COMPLETED':
                return <span className="flex items-center gap-1.5 text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"><CheckCircle className="w-3.5 h-3.5" /> Tamamlanıb</span>;
            case 'CANCELED':
                return <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"><XCircle className="w-3.5 h-3.5" /> Ləğv edilib</span>;
            default:
                return null;
        }
    };

    const showRateButton = safeStatus === 'COMPLETED' && role !== 'worker' && role !== 'admin' && !hasReviewed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:shadow-2xl hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-500 z-10"
        >
            {/* Subtle inner light reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />

            {/* Confetti / Burst effect when completing */}
            <AnimatePresence>
                {isCompleting && (
                    <motion.div
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 bg-green-500/20 z-0 rounded-3xl"
                    />
                )}
            </AnimatePresence>

            <div className="flex items-start gap-5 relative z-10 w-full md:w-auto">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 shrink-0 border border-primary-200 dark:border-primary-500/20 shadow-inner">
                    <Scissors className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {app.service?.name || "Bilinməyən Xidmət"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                            <Calendar className="w-4 h-4 text-primary-500" />
                            {format(new Date(app.date), 'dd MMMM yyyy', { locale: az })}
                        </span>
                        <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md text-primary-600 dark:text-primary-400">
                            <Clock className="w-4 h-4" />
                            {app.startTime.substring(0, 5)} - {app.endTime.substring(0, 5)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-200 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between md:justify-end w-full gap-5">

                    <div className="flex items-center gap-3 bg-white dark:bg-black/20 p-1.5 pr-4 rounded-full border border-zinc-200 dark:border-white/5 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                {targetInitial}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase text-zinc-400 dark:text-zinc-500 font-bold tracking-widest leading-none mb-0.5">
                                {personLabel}
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-none">
                                {targetName}
                            </span>
                        </div>
                    </div>

                    {!isHovered || !isPending ? (
                        <div className="flex items-center gap-3 transition-opacity duration-300">
                            {getStatusBadge(safeStatus)}
                            {showRateButton && (
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all shadow-sm"
                                >
                                    <Star className="w-3.5 h-3.5" />
                                    Dəyərləndir
                                </button>
                            )}
                        </div>
                    ) : null}

                    {/* Action Buttons via Framer Motion sliding in on hover */}
                    <AnimatePresence>
                        {isHovered && isPending && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: "auto" }}
                                exit={{ opacity: 0, x: 10, width: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="flex items-center gap-2 overflow-hidden"
                            >
                                <motion.button
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                                    title="Ləğv et"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    onClick={handleComplete}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center gap-1.5 px-4 h-9 rounded-full bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-400 font-medium tracking-wide hover:bg-green-600 transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Tamamla</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Interactive Review Modal */}
                    <AnimatePresence>
                        {isReviewModalOpen && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="relative w-full max-w-md bg-zinc-950/90 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                                    <div className="relative z-10 flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                            <Star className="w-5 h-5 text-indigo-400" />
                                            Xidməti Dəyərləndirin
                                        </h3>
                                        <button
                                            onClick={() => setIsReviewModalOpen(false)}
                                            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleReviewSubmit} className="relative z-10 flex flex-col gap-6">
                                        <div className="flex flex-col items-center py-5 bg-black/40 border border-white/5 rounded-2xl shadow-inner">
                                            <p className="text-zinc-400 font-semibold text-sm mb-3">Xidmətdən razı qaldınız?</p>
                                            <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={`star-${star}`}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                                                    >
                                                        <Star
                                                            className={`w-9 h-9 transition-colors duration-200 ${(hoverRating || rating) >= star
                                                                    ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                                                    : "text-zinc-600"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                                                <MessageSquare className="w-3.5 h-3.5" /> Əlavə Rəy (İstəyə bağlı)
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Xidmət barədə öz fikirlərini və təcrübəni qeyd et..."
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all resize-none shadow-inner"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview || rating === 0}
                                            className="w-full h-12 flex items-center justify-center gap-2 font-bold bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:bg-indigo-600 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-2"
                                        >
                                            {isSubmittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : "Rəyi Göndər"}
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </motion.div>
    );
}
