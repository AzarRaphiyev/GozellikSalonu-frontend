"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Briefcase, X, TrendingUp, Sparkles } from "lucide-react";

interface WorkerStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = "daily" | "weekly" | "monthly";

const MOCK_DATA = {
    daily: { revenue: 150, jobs: 4 },
    weekly: { revenue: 1250, jobs: 28 },
    monthly: { revenue: 4800, jobs: 112 },
};

function NumberTicker({ value, prefix = "" }: { value: number, prefix?: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const duration = 800;
        const start = performance.now();
        const startValue = 0; // Always animate from 0 for the "wow" effect when switching tabs

        const update = () => {
            const now = performance.now();
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo for smoother deceleration
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplay(Math.floor(startValue + (value - startValue) * easeOutExpo));

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setDisplay(value);
            }
        };
        requestAnimationFrame(update);
    }, [value]);

    return <span>{prefix}{display.toLocaleString("az-AZ")}</span>;
}

export function WorkerStatsModal({ isOpen, onClose }: WorkerStatsModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("daily");

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const tabs: { id: TabType; label: string }[] = [
        { id: "daily", label: "Gündəlik" },
        { id: "weekly", label: "Həftəlik" },
        { id: "monthly", label: "Aylıq" },
    ];

    const currentData = MOCK_DATA[activeTab];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350, bounce: 0.3 }}
                        className="relative w-full max-w-lg bg-black/80 border border-white/10 rounded-[2rem] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* Ambient inner glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-400" />
                                    Statistika
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">İş və gəlir göstəriciləriniz</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Segmented Control */}
                        <div className="relative flex p-1 mb-10 bg-black/60 border border-white/10 rounded-2xl z-10 shadow-inner">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors duration-300 ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="statsTabIndicator"
                                                className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-sm"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                        <span className="relative z-10">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                            {/* Revenue Card */}
                            <motion.div
                                key={`revenue-${activeTab}`} // Force re-render of glow slightly if wanted, but better not keying
                                className="relative overflow-hidden bg-black/40 border border-white/5 rounded-3xl p-6 group transition-colors hover:bg-white/[0.02]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <span className="text-zinc-300 font-medium text-sm">Ümumi Gəlir</span>
                                </div>
                                <div className="flex items-baseline gap-1.5 mt-2">
                                    <span className="text-4xl font-extrabold text-white tracking-tight">
                                        <NumberTicker value={currentData.revenue} />
                                    </span>
                                    <span className="text-emerald-400 font-semibold text-sm">AZN</span>
                                </div>
                                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400/80">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span className="font-medium">+12% əvvəlki dövrə görə</span>
                                </div>
                            </motion.div>

                            {/* Jobs Card */}
                            <motion.div
                                className="relative overflow-hidden bg-black/40 border border-white/5 rounded-3xl p-6 group transition-colors hover:bg-white/[0.02]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <span className="text-zinc-300 font-medium text-sm">Tamamlanan İş</span>
                                </div>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-4xl font-extrabold text-white tracking-tight">
                                        <NumberTicker value={currentData.jobs} />
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400/80">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="font-medium">Mükəmməl nəticə</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
