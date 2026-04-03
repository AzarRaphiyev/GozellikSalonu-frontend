"use client";

import * as React from "react";
import Link from "next/link";
import { User, Menu, X, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { AuthModal } from "./auth/AuthModal";

const navLinks = [
    { name: "Ana Səhifə", href: "/" },
    { name: "Xidmətlər", href: "/#xidmetler" },
    { name: "Haqqımızda", href: "/#haqqimizda" },
    { name: "Əlaqə", href: "/#elaqe" },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isAuthOpen, setIsAuthOpen] = React.useState(false);
    const [authView, setAuthView] = React.useState<"login" | "register">("login");

    // Auth State-ləri
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userRole, setUserRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            setIsLoggedIn(true);
            try {
                // JWT Token-i Frontend-də oxumaq (Deşifrə etmək)
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                const decodedToken = JSON.parse(jsonPayload);
                setUserRole(decodedToken.role); // 'admin', 'customer', və ya 'worker'
            } catch (error) {
                console.error("Token oxunarkən xəta baş verdi", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.reload();
    };

    const openAuth = (view: "login" | "register") => {
        setAuthView(view);
        setIsAuthOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-500">
                                Gözəllik Salonu
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />

                        {isLoggedIn ? (
                            <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                                {userRole === "admin" ? (
                                    <Link href="/admin">
                                        <Button variant="ghost" size="sm" className="text-primary-600 gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/dashboard">
                                        <Button variant="ghost" size="sm" className="text-primary-600 gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <Button size="sm" variant="outline" className="gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                    Çıxış
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                                <Button variant="ghost" size="sm" onClick={() => openAuth("login")}>
                                    Giriş
                                </Button>
                                <Button size="sm" onClick={() => openAuth("register")}>
                                    Qeydiyyat
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-b border-border/40 bg-background px-4 py-4 shadow-sm">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800">
                                {isLoggedIn ? (
                                    <>
                                        {userRole === "admin" ? (
                                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-center gap-2 text-primary-600">
                                                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-center gap-2 text-primary-600">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                        <Button className="w-full justify-center gap-2 bg-red-500 hover:bg-red-600 text-white" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4" /> Çıxış
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" className="w-full justify-center" onClick={() => openAuth("login")}>
                                            Giriş
                                        </Button>
                                        <Button className="w-full justify-center" onClick={() => openAuth("register")}>
                                            Qeydiyyat
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialView={authView}
            />
        </>
    );
}