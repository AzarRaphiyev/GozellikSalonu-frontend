"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "@/lib/api";
import { toast } from 'sonner';

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "register";
};

export function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
    const [view, setView] = React.useState<"login" | "register">(initialView);
    
    // Form məlumatlarını tutmaq üçün state-lər
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setView(initialView);
        }
    }, [isOpen, initialView]);

    // --- GİRİŞ FUNKSİYASI ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            
            // DÜZƏLİŞ 1: Backend 'token' qaytarır, 'access_token' yox.
            // Həmçinin api.ts faylımız response.json() etdiyi üçün məlumat birbaşa response içindədir.
            const token = response.token || response.data?.token;
            
            if (token) {
                localStorage.setItem("token", token);
                toast.success("Xoş gəldiniz!", {
                    description: "Sistemə uğurla daxil oldunuz.",
                })
                onClose();
                window.location.reload(); 
            } else {
                throw new Error("Token alınmadı");
            }
        } catch (error: any) {
           toast.error("Xəta baş verdi", {
    description: error.message || "Məlumatlarınızı yoxlayıb yenidən cəhd edin.",
})
        } finally {
            setLoading(false);
        }
    };

    // --- QEYDİYYAT FUNKSİYASI ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // DÜZƏLİŞ 2: Backend bizdən tam olaraq 'name', 'email' və 'password' gözləyir.
            await api.post("/auth/register", {
                name: fullName,
                email,
                password,
            });
            
            toast.success("Təbriklər!", {
                description: "Qeydiyyat uğurla tamamlandı. İndi giriş edə bilərsiniz.",
            });
            setView("login");
            // Qeydiyyatdan sonra formu təmizləyək
            setPassword("");
        } catch (error: any) {
            toast.error("Xəta baş verdi", {
                description: error.message || "Məlumatlarınızı yoxlayıb yenidən cəhd edin.",
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl sm:p-8"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="absolute right-4 top-4 h-12 w-12 rounded-full p-0"
                        >
                            <X className="h-8 w-8" />
                        </Button>

                        <AnimatePresence mode="wait">
                            {view === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="flex flex-col gap-2 text-center">
                                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Giriş</h2>
                                        <p className="text-sm text-foreground/60">Hesabınıza daxil olun</p>
                                    </div>
                                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                                        <Input 
                                            label="Email" 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nümunə@email.az" 
                                            required 
                                        />
                                        <Input 
                                            label="Şifrə" 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••" 
                                            required 
                                        />
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Yüklənir..." : "Giriş et"}
                                        </Button>
                                    </form>
                                    <div className="text-center text-sm text-foreground/60">
                                        Hesabınız yoxdur?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setView("register")}
                                            className="font-medium text-primary-600 hover:text-primary-500"
                                        >
                                            Qeydiyyatdan keçin
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="flex flex-col gap-2 text-center">
                                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Qeydiyyat</h2>
                                        <p className="text-sm text-foreground/60">Yeni hesab yaradın</p>
                                    </div>
                                    <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                                        <Input 
                                            label="Ad və Soyad" 
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            type="text" 
                                            placeholder="Məmməd Məmmədov" 
                                            required 
                                        />
                                        <Input 
                                            label="Email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email" 
                                            placeholder="nümunə@email.az" 
                                            required 
                                        />
                                        <Input 
                                            label="Şifrə" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password" 
                                            placeholder="••••••••" 
                                            required 
                                        />
                                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                                            {loading ? "Gözləyin..." : "Qeydiyyatdan keç"}
                                        </Button>
                                    </form>
                                    <div className="text-center text-sm text-foreground/60">
                                        Artıq hesabınız var?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setView("login")}
                                            className="font-medium text-primary-600 hover:text-primary-500"
                                        >
                                            Giriş edin
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}