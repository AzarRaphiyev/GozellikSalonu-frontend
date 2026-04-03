"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Clock, DollarSign, Loader2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export type Service = {
    id: number;
    name: string;
    description: string;
    price: number;
    durationInMinutes: number;
};

interface AdminServicesProps {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

export function AdminServices({ services, setServices }: AdminServicesProps) {
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Silmə əməliyyatı
    const handleDelete = async (id: number) => {
        if (!confirm("Bu xidməti silmək istədiyinizə əminsiniz?")) return;
        
        try {
            await api.delete(`/services/${id}`);
            setServices(prev => prev.filter(s => s.id !== id));
            toast.success("Xidmət silindi", { description: "Xidmət sistemdən uğurla silindi." });
        } catch (error: any) {
            toast.error("Xəta", { description: "Xidməti silmək mümkün olmadı." });
        }
    };

    // Redaktə əməliyyatı
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        setIsSubmitting(true);
        try {
            const payload = {
                name: editingService.name,
                description: editingService.description,
                price: Number(editingService.price),
                durationInMinutes: Number(editingService.durationInMinutes),
            };

            const response = await api.patch(`/services/${editingService.id}`, payload);
            const updatedService = response.data || response;

            setServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
            setEditingService(null);
            toast.success("Yeniləndi", { description: "Xidmət məlumatları uğurla yeniləndi." });
        } catch (error: any) {
            toast.error("Xəta", { description: "Məlumatları yeniləmək mümkün olmadı." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {services.map((srv) => (
                        <motion.div
                            key={srv.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -5, borderColor: "rgba(234,179,8,0.3)" }}
                            className="bg-background/80 backdrop-blur-xl border border-white/60 dark:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-colors shadow-sm group"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-foreground">{srv.name}</h3>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingService(srv)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(srv.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/60 line-clamp-2 mb-4">{srv.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-500">
                                    <DollarSign className="w-4 h-4" /> {srv.price} AZN
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                                    <Clock className="w-4 h-4" /> {srv.durationInMinutes} dəq.
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {services.length === 0 && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-border/60 rounded-3xl flex flex-col items-center">
                        <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3 opacity-50" />
                        <p className="text-foreground/50 font-medium">Sistemdə heç bir xidmət tapılmadı.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingService(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-background border border-border/60 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                                    <Edit2 className="w-6 h-6 text-blue-500" /> Xidməti Redaktə Et
                                </h2>
                                <button onClick={() => setEditingService(null)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                    <X className="w-5 h-5 text-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleEdit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Xidmətin Adı</label>
                                    <input required type="text" value={editingService.name} onChange={(e) => setEditingService({...editingService, name: e.target.value})} className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Qiymət (AZN)</label>
                                        <input required type="number" min="0" value={editingService.price} onChange={(e) => setEditingService({...editingService, price: Number(e.target.value)})} className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Müddət (Dəq)</label>
                                        <input required type="number" min="5" step="5" value={editingService.durationInMinutes} onChange={(e) => setEditingService({...editingService, durationInMinutes: Number(e.target.value)})} className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/60 mb-1.5 uppercase">Təsvir</label>
                                    <textarea required rows={3} value={editingService.description} onChange={(e) => setEditingService({...editingService, description: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 flex items-center justify-center gap-2 font-bold bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yadda Saxla"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}