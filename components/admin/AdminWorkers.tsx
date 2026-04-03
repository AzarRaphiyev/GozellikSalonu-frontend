"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, User, Mail, Briefcase, Trash2, Edit2, Loader2, AlertCircle, X, CheckCircle2, Shield, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type Worker = {
    id: number;
    name: string;
    email?: string; // Bəzən birbaşa provider üzərində
    title?: string;
    user?: { email: string }; // Və ya user obyekti daxilində
};

export function AdminWorkers() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        title: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await api.get("/providers");
                const data = response.data || response;
                if (Array.isArray(data)) {
                    setWorkers(data);
                }
            } catch (error) {
                console.error("Xəta baş verdi:", error);
                toast.error("İşçiləri yükləmək mümkün olmadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    const openAddModal = () => {
        setEditingWorker(null);
        setFormData({ name: "", email: "", password: "", title: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (w: Worker) => {
        setEditingWorker(w);
        setFormData({
            name: w.name,
            email: w.email || w.user?.email || "",
            password: "",
            title: w.title || "",
        });
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload: any = {
                name: formData.name,
                title: formData.title,
                email: formData.email,
            };
            if (!editingWorker) {
                payload.password = formData.password; // Yalnız əlavə edəndə və ya dəyişəndə tələb olunur
            } else if (formData.password) {
                payload.password = formData.password;
            }

            if (editingWorker) {
                const response = await api.patch(`/providers/${editingWorker.id}`, payload);
                const updatedWorker = response.data || response;
                setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? { ...w, ...updatedWorker, email: payload.email || updatedWorker.email } : w));
                toast.success("Uğurlu", { description: "İşçi məlumatları yeniləndi." });
            } else {
                const response = await api.post("/providers", payload);
                const newWorker = response.data || response;
                setWorkers(prev => [{ ...newWorker, email: payload.email }, ...prev]);
                toast.success("Uğurlu", { description: "Yeni işçi əlavə edildi." });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error("Xəta", { description: error.response?.data?.message || error.message || "Əməliyyat uğursuz oldu." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/providers/${id}`);
            setWorkers(prev => prev.filter(w => w.id !== id));
            toast.success("Uğurlu", { description: "İşçi sistemdən silindi." });
            setDeleteConfirmId(null);
        } catch (error: any) {
            toast.error("Xəta", { description: error.response?.data?.message || error.message || "Silmək mümkün olmadı." });
        }
    };

    const springConfig = { type: "spring" as const, stiffness: 300, damping: 25 };

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "?";

    return (
        <div className="w-full mt-12 pb-12">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-500" />
                    İşçilərin İdarəetməsi
                </h2>
                <button
                    onClick={openAddModal}
                    className="px-5 py-2.5 flex items-center justify-center gap-2 text-sm font-bold bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:bg-indigo-600 transition-all hover:-translate-y-1"
                >
                    <Plus className="w-4 h-4" /> Yeni İşçi
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {workers.map((w) => {
                            const email = w.email || w.user?.email || "Email yoxdur";
                            const initial = getInitial(w.name);

                            return (
                                <motion.div
                                    key={`worker-${w.id}`}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100, scale: 0.95 }}
                                    transition={springConfig}
                                    whileHover="hover"
                                    className="group relative bg-background/50 backdrop-blur-xl border border-border/60 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Subtle Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                                    <div className="flex items-center gap-5 relative z-0">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-200 dark:border-indigo-500/20 shadow-inner shrink-0">
                                            {initial}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-bold text-foreground">
                                                {w.name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-foreground/60">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{email}</span>
                                                <span className="text-border hidden sm:block">•</span>
                                                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{w.title || "Vəzifə təyin edilməyib"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <motion.div
                                        variants={{
                                            initial: { opacity: 0, x: 10 },
                                            hover: { opacity: 1, x: 0 }
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className="relative z-10 flex gap-2"
                                    >
                                        <button
                                            onClick={() => openEditModal(w)}
                                            className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-border/50 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all shadow-sm"
                                            title="Redaktə et"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(w.id)}
                                            className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-border/50 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>

                                    {/* Delete Confirmation Modal Overlay */}
                                    <AnimatePresence>
                                        {deleteConfirmId === w.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-20 bg-background/80 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 border border-red-500/20"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                                    <div>
                                                        <h4 className="font-bold text-foreground text-sm">İşçini silmək istəyirsiniz?</h4>
                                                        <p className="text-xs text-foreground/60">Bu addım geri qaytarılmır.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="px-4 py-2 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground rounded-lg transition-colors"
                                                    >
                                                        İmtina
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(w.id)}
                                                        className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md shadow-red-500/20"
                                                    >
                                                        Bəli, Sil
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {workers.length === 0 && (
                        <div className="w-full py-16 text-center border-2 border-dashed border-border/50 rounded-3xl mt-2">
                            <p className="text-foreground/50 text-lg">Hələ heç bir işçi təyin edilməyib.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Complete Add / Edit Worker Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={springConfig}
                            className="relative w-full max-w-2xl bg-background/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[40%] h-32 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl">
                                            {editingWorker ? <Edit2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                        </div>
                                        {editingWorker ? "İşçi Məlumatlarını Yenilə" : "Yeni İşçi Formu"}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-foreground/70" />
                                    </button>
                                </div>

                                <form onSubmit={handleModalSubmit} className="flex flex-col gap-6">

                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Account Details */}
                                        <div className="flex-1 flex flex-col gap-4 p-5 bg-zinc-50 dark:bg-black/20 border border-border/50 rounded-2xl shadow-inner">
                                            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                <Shield className="w-3.5 h-3.5" /> Hesab Məlumatları
                                            </h3>

                                            <div>
                                                <label className="block text-[11px] font-bold text-foreground/60 mb-1.5 uppercase tracking-wider">Tam Ad</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Məs: Cavid Quliyev"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full h-11 px-3 bg-white dark:bg-black/40 border border-border/60 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-foreground/60 mb-1.5 uppercase tracking-wider">Elektron Poçt</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="cavid@mail.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full h-11 pl-9 pr-3 bg-white dark:bg-black/40 border border-border/60 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-foreground/60 mb-1.5 uppercase tracking-wider">Şifrə</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                                    <input
                                                        required={!editingWorker}
                                                        type="password"
                                                        placeholder={editingWorker ? "(Dəyişmək istəmirsinizsə boş saxlayın)" : "Güclü şifrə yazın..."}
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="w-full h-11 pl-9 pr-3 bg-white dark:bg-black/40 border border-border/60 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Details */}
                                        <div className="flex-1 flex flex-col gap-4 p-5 bg-zinc-50 dark:bg-black/20 border border-border/50 rounded-2xl shadow-inner">
                                            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                <Briefcase className="w-3.5 h-3.5" /> Peşəkar Məlumat
                                            </h3>

                                            <div>
                                                <label className="block text-[11px] font-bold text-foreground/60 mb-1.5 uppercase tracking-wider">Vəzifə / Titul</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Məs: Usta Saç Kəsimi"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        className="w-full h-11 pl-9 pr-3 bg-white dark:bg-black/40 border border-border/60 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/40 rounded-xl text-foreground/40 text-xs p-4 text-center mt-2">
                                                Əlavə icazələr və fəaliyyət parametrlərini gələcəkdə "Tənzimləmələr" hissəsindən idarə edə bilərsiniz.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 h-12 flex items-center justify-center gap-2 font-bold bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:bg-indigo-600 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    {editingWorker ? "Yadda Saxla" : "Təsdiqlə və Yarat"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
