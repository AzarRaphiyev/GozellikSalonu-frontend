"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Calendar, Clock, CheckCircle, XCircle, Clock4, Loader2, Scissors, FilterX } from "lucide-react";
import { format } from "date-fns";
import { az } from "date-fns/locale";

type Appointment = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string; // backend-dən kiçik və ya böyük hərflə gələ bilər
    service: { name: string; price: number };
    worker?: { name: string, email?: string }; 
    customer?: { name: string, email?: string };
    provider?: { name: string, title?: string }; 
};

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    
    // Filter State-ləri
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
    const [serviceFilter, setServiceFilter] = useState<string>('');
    const [personFilter, setPersonFilter] = useState<string>(''); 
    const [dateFilter, setDateFilter] = useState<string>('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                window.location.href = "/";
                return;
            }

            try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const decodedToken = JSON.parse(decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
                setRole(decodedToken.role);

                const response = await api.get("/appointments");
                const data = response.data || response;
                
                if (Array.isArray(data)) {
                    // DÜZƏLİŞ 2: Ən son edilən rezervasiyanı (ID-si ən böyük olanı) ən yuxarıya qoyur
                    const sortedData = data.sort((a, b) => b.id - a.id);
                    setAppointments(sortedData);
                }
            } catch (error) {
                console.error("Məlumatlar yüklənərkən xəta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // DÜZƏLİŞ 3: Roluna görə düzgün adı göstərmək
  const getPersonName = (app: Appointment, currentRole: string | null) => {
        if (currentRole === 'worker') {
            return app.customer?.name || "Bilinməyən Müştəri";
        } else if (currentRole === 'admin') {
            const customerName = app.customer?.name || 'Müştəri';
            const workerName = app.worker?.name || app.provider?.name || 'Usta';
            return `${customerName} ➔ ${workerName}`;
        } else {
            // DÜZƏLİŞ: MÜŞTƏRİ ÜÇÜN
            // Backend necə göndərirsə göndərsin, worker.name və ya sadəcə worker obyekti varsa onu çıxar
            return app.worker?.name || app.provider?.name || "Bilinməyən Usta";
        }
    };

    const getPersonLabel = (currentRole: string | null) => {
        if (currentRole === 'worker') return 'Müştəri';
        if (currentRole === 'admin') return 'Rezervasiya';
        return 'Usta';
    };

    const uniqueServices = useMemo(() => {
        return Array.from(new Set(appointments.map(a => a.service?.name).filter(Boolean)));
    }, [appointments]);

    const uniquePersons = useMemo(() => {
        return Array.from(new Set(appointments.map(a => getPersonName(a, role)).filter(name => name && !name.includes("Bilinməyən"))));
    }, [appointments, role]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            // DÜZƏLİŞ 1: Backend-dən gələn statusu böyük hərfə çeviririk ki, dəqiq uyğun gəlsin
            const safeStatus = (app.status || '').toUpperCase();

            if (statusFilter === 'UPCOMING' && safeStatus !== 'PENDING' && safeStatus !== 'CONFIRMED') return false;
            if (statusFilter === 'PAST' && safeStatus !== 'COMPLETED' && safeStatus !== 'CANCELED') return false;
            if (serviceFilter && app.service?.name !== serviceFilter) return false;
            
            if (personFilter) {
                const targetName = getPersonName(app, role);
                if (targetName !== personFilter) return false;
            }

            if (dateFilter && app.date !== dateFilter) return false;

            return true;
        });
    }, [appointments, statusFilter, serviceFilter, personFilter, dateFilter, role]);

    const clearFilters = () => {
        setServiceFilter('');
        setPersonFilter('');
        setDateFilter('');
        setStatusFilter('ALL');
    };

    const isAnyFilterActive = serviceFilter !== '' || personFilter !== '' || dateFilter !== '' || statusFilter !== 'ALL';

    const getStatusBadge = (status: string) => {
        const safeStatus = (status || '').toUpperCase();
        switch (safeStatus) {
            case 'PENDING': 
            case 'CONFIRMED':
                return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full text-xs font-medium"><Clock4 className="w-3 h-3"/> Gözləyir</span>;
            case 'COMPLETED': 
                return <span className="flex items-center gap-1 text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3"/> Tamamlanıb</span>;
            case 'CANCELED': 
                return <span className="flex items-center gap-1 text-red-600 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3"/> Ləğv edilib</span>;
            default: 
                return null;
        }
    };

    const getInitial = (name: string) => {
        if (!name || name.includes("Bilinməyən")) return "?";
        return name.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-foreground/60 animate-pulse">Məlumatlarınız yüklənir...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 py-12 px-4 dark:bg-zinc-950/50 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
                
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {role === 'worker' ? 'İşçi Paneli' : role === 'admin' ? 'Bütün Rezervasiyalar' : 'Mənim Rezervasiyalarım'}
                        </h1>
                        <p className="mt-2 text-foreground/60">
                            {role === 'worker' ? 'Sizə təyin olunmuş bütün işləri buradan idarə edin.' : 'Keçmiş və qarşıdan gələn bütün rezervasiyalarınız buradadır.'}
                        </p>
                    </div>
                    
                    <div className="flex bg-background border border-border/40 p-1 rounded-xl shadow-sm w-fit">
                        <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${statusFilter === 'ALL' ? 'bg-primary-500 text-white shadow-md' : 'text-foreground/70 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>Bütün</button>
                        <button onClick={() => setStatusFilter('UPCOMING')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${statusFilter === 'UPCOMING' ? 'bg-primary-500 text-white shadow-md' : 'text-foreground/70 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>Qarşıdan gələn</button>
                        <button onClick={() => setStatusFilter('PAST')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${statusFilter === 'PAST' ? 'bg-primary-500 text-white shadow-md' : 'text-foreground/70 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>Keçmiş</button>
                    </div>
                </div>

                <div className="mb-8 p-4 bg-background border border-border/40 rounded-2xl shadow-sm flex flex-col sm:flex-row flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wider">Xidmət Növü</label>
                        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                            <option value="">Bütün xidmətlər</option>
                            {uniqueServices.map((srv, idx) => <option key={idx} value={srv}>{srv}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wider">
                            {getPersonLabel(role)} Adı
                        </label>
                        <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)} className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                            <option value="">Hamısı</option>
                            {uniquePersons.map((person, idx) => <option key={idx} value={person}>{person}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px] w-full">
                        <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase tracking-wider">Tarix</label>
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                    </div>

                    {isAnyFilterActive && (
                        <div className="mt-5">
                            <button onClick={clearFilters} className="h-10 px-4 flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-900/30 rounded-lg transition-colors">
                                <FilterX className="w-4 h-4" /> Təmizlə
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((app) => {
                                const targetName = getPersonName(app, role);
                                const targetInitial = getInitial(targetName);
                                
                                return (
                                <motion.div
                                    key={app.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-background border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-500 shrink-0">
                                            <Scissors className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-bold text-foreground">
                                                {app.service?.name || "Bilinməyən Xidmət"}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-foreground/60">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(app.date), 'dd MMMM yyyy', { locale: az })}
                                                </span>
                                                <span className="hidden md:block text-border">•</span>
                                                <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium">
                                                    <Clock className="w-4 h-4" />
                                                    {app.startTime.substring(0, 5)} - {app.endTime.substring(0, 5)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                                        <div className="flex items-center justify-between md:justify-end w-full gap-4">
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                                                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                                                        {targetInitial}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider">
                                                        {getPersonLabel(role)}
                                                    </span>
                                                    <span className="text-sm font-medium text-foreground">
                                                        {targetName}
                                                    </span>
                                                </div>
                                            </div>

                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>
                                </motion.div>
                            )})
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-3xl">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                    <FilterX className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Heç bir nəticə tapılmadı</h3>
                                <p className="text-foreground/60 max-w-sm mt-2">Seçdiyiniz filterlərə uyğun rezervasiya mövcud deyil.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}