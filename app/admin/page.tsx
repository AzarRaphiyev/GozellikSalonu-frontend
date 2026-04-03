"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Scissors, Activity, Loader2, LayoutDashboard, TrendingUp } from "lucide-react";
import { AdminServices, type Service } from "@/components/admin/AdminServices";
import { AdminWorkers } from "@/components/admin/AdminWorkers";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TabType = "overview" | "services" | "workers";

// Qrafik üçün statik məlumatlar (Gələcəkdə Backend-dən gələcək)
const data7Days = [
    { name: "B.e", revenue: 450 },
    { name: "Ç.a", revenue: 700 },
    { name: "Çər", revenue: 580 },
    { name: "C.a", revenue: 900 },
    { name: "Cüm", revenue: 1200 },
    { name: "Şən", revenue: 1650 },
    { name: "Baz", revenue: 1400 },
];

const data6Months = [
    { name: "Noy", revenue: 8400 },
    { name: "Dek", revenue: 11200 },
    { name: "Yan", revenue: 9800 },
    { name: "Fev", revenue: 13500 },
    { name: "Mart", revenue: 16800 },
    { name: "Apr", revenue: 14200 },
];

const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Ümumi Baxış" },
    { id: "services", label: "Xidmətlər" },
    { id: "workers", label: "İşçilər" },
];

export default function AdminDashboard() {
    const [loading, setLoading] = useState<boolean>(true);
    const [services, setServices] = useState<Service[]>([]);
    const [appointmentCount, setAppointmentCount] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [chartView, setChartView] = useState<"7days" | "6months">("7days");

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            
            if (!token) {
                if (typeof window !== "undefined") window.location.href = "/";
                return;
            }

            try {
                // Rol yoxlanışı
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                const decodedToken = JSON.parse(jsonPayload);

                if (decodedToken.role !== "admin") {
                    toast.error("Giriş qadağandır", { description: "Bu səhifəyə yalnız adminlər daxil ola bilər." });
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1000);
                    return;
                }

                // API sorğuları
                const [servicesRes, appointmentsRes] = await Promise.all([
                    api.get("/services"),
                    api.get("/appointments")
                ]);

                const srvData = servicesRes.data || servicesRes;
                if (Array.isArray(srvData)) {
                    setServices(srvData);
                }

                const appData = appointmentsRes.data || appointmentsRes;
                if (Array.isArray(appData)) {
                    setAppointmentCount(appData.length);
                }

            } catch (error: any) {
                console.error("Məlumat xətası:", error);
                toast.error("Sistem xətası", { description: "Məlumatları yükləmək mümkün olmadı." });
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const chartData = chartView === "7days" ? data7Days : data6Months;

    if (loading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-foreground/60 animate-pulse font-medium">İdarəetmə paneli yüklənir...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 dark:bg-zinc-950/50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            <div className="container mx-auto max-w-6xl relative z-10 flex flex-col">

                {/* --- HEADER & TABS --- */}
                <div className="flex flex-col items-center mb-10 w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3 mb-8">
                        <LayoutDashboard className="w-8 h-8 text-primary-500" />
                        İdarəetmə Paneli
                    </h1>

                    {/* Floating Pill Navigation (Antigravity Tab) */}
                    <div className="relative p-1.5 flex items-center bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 py-2.5 px-4 text-sm font-semibold rounded-full transition-colors duration-300 outline-none ${
                                        isActive 
                                            ? "text-primary-600 dark:text-white" 
                                            : "text-foreground/60 hover:text-foreground/80 dark:text-white/50 dark:hover:text-white/80"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="adminTabIndicator"
                                            className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 block text-center w-full">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- TAB CONTENT VIEWS --- */}
                <div className="w-full flex-1 relative">
                    <AnimatePresence mode="wait">
                        
                        {/* 1. ÜMUMİ BAXIŞ TABI */}
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mt-8 w-full"
                            >
                                {/* Antigravity Stat Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-background/80 backdrop-blur-xl border border-white/60 dark:border-white/10 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                                    >
                                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/20 transition-all duration-500" />
                                        <div className="flex items-center gap-5 mb-6 relative z-10">
                                            <div className="p-3.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-500 rounded-2xl shadow-inner border border-primary-100 dark:border-primary-500/20">
                                                <Scissors className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground/80">Aktiv Xidmətlər</h3>
                                        </div>
                                        <p className="text-5xl font-black text-foreground relative z-10">{services.length}</p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-background/80 backdrop-blur-xl border border-white/60 dark:border-white/10 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                                    >
                                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
                                        <div className="flex items-center gap-5 mb-6 relative z-10">
                                            <div className="p-3.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 rounded-2xl shadow-inner border border-blue-100 dark:border-blue-500/20">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground/80">Ümumi Rezervlər</h3>
                                        </div>
                                        <p className="text-5xl font-black text-foreground relative z-10">{appointmentCount}</p>
                                    </motion.div>
                                </div>

                                {/* Revenue Chart */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-background/80 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 max-w-4xl mx-auto"
                                >
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl border border-emerald-500/20 shadow-inner">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground tracking-tight">Qazanc Qrafiki</h3>
                                                <p className="text-sm text-foreground/60 mt-0.5">Sistemin gəlir dinamikası</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-zinc-100 dark:bg-black/50 border border-border/50 dark:border-white/10 rounded-xl p-1 shadow-inner h-10">
                                            <button
                                                onClick={() => setChartView("7days")}
                                                className={`px-4 py-1.5 h-full text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${chartView === "7days" ? "bg-white dark:bg-white/10 text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"}`}
                                            >
                                                7 Gün
                                            </button>
                                            <button
                                                onClick={() => setChartView("6months")}
                                                className={`px-4 py-1.5 h-full text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${chartView === "6months" ? "bg-white dark:bg-white/10 text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"}`}
                                            >
                                                6 Ay
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-[300px] w-full relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--tw-colors-zinc-500, #71717a)" }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--tw-colors-zinc-500, #71717a)" }} dx={-10} tickFormatter={(value:number) => `${value}`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", color: "#fff", backdropFilter: "blur(10px)" }}
                                                    itemStyle={{ color: "#34d399", fontWeight: "bold" }}
                                                    formatter={(value: number) => [`${value} AZN`, "Gəlir"]}
                                                    labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                    animationDuration={1500}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 2. XİDMƏTLƏR TABI */}
                        {activeTab === "services" && (
                            <motion.div
                                key="services"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mt-8 w-full block"
                            >
                                <AdminServices services={services} setServices={setServices} />
                            </motion.div>
                        )}

                        {/* 3. İŞÇİLƏR TABI */}
                        {activeTab === "workers" && (
                            <motion.div
                                key="workers"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mt-8 w-full block"
                            >
                                <AdminWorkers />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}