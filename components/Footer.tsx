import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
                    {/* About Section */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <h3 className="text-xl font-bold text-primary-600 dark:text-primary-500 mb-6">
                            Gözəllik Salonu
                        </h3>
                        <p className="text-base text-foreground/80 leading-relaxed max-w-sm">
                            Premium xidmət və yüksək keyfiyyətli məhsullarla sizin gözəlliyinizi əks etdiririk.
                            Peşəkar ustalarımızla hər zaman xidmətinizdəyik.
                        </p>
                    </div>

                    {/* Useful Links */}
                    <div className="md:col-span-1">
                        <h3 className="text-base font-semibold tracking-wider text-foreground uppercase mb-6">
                            Faydalı Linklər
                        </h3>
                        <ul className="space-y-4 pl-0 list-none">
                            <li>
                                <Link href="/#qaydalar" className="text-base text-foreground/70 transition-colors hover:text-primary-500">
                                    Qaydalar
                                </Link>
                            </li>
                            <li>
                                <Link href="/#mexfilik" className="text-base text-foreground/70 transition-colors hover:text-primary-500">
                                    Məxfilik siyasəti
                                </Link>
                            </li>
                            <li>
                                <Link href="/#faq" className="text-base text-foreground/70 transition-colors hover:text-primary-500">
                                    Tez-tez verilən suallar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <h3 className="text-base font-semibold tracking-wider text-foreground uppercase mb-6">
                            Əlaqə
                        </h3>
                        <ul className="space-y-6 pl-0 list-none">
                            <li className="flex items-start text-base text-foreground/70">
                                <MapPin className="mr-4 h-8 w-8 shrink-0 text-primary-500" />
                                <span className="mt-1">Nizami küçəsi 100, Bakı, Azərbaycan</span>
                            </li>
                            <li className="flex items-center text-base text-foreground/70">
                                <Phone className="mr-4 h-8 w-8 shrink-0 text-primary-500" />
                                <span>+994 50 123 45 67</span>
                            </li>
                            <li className="flex items-center text-base text-foreground/70">
                                <Mail className="mr-4 h-8 w-8 shrink-0 text-primary-500" />
                                <span>info@gozelliksalonu.az</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between border-t border-border/40 pt-8 sm:flex-row">
                    <p className="text-base text-foreground/60">
                        © {currentYear} Bütün hüquqlar qorunur.
                    </p>
                    <div className="mt-6 flex space-x-8 sm:mt-0">
                        <a href="#" className="text-foreground/50 hover:text-primary-500 transition-colors">
                            <span className="sr-only">Facebook</span>
                            <Facebook className="h-8 w-8" />
                        </a>
                        <a href="#" className="text-foreground/50 hover:text-primary-500 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <Instagram className="h-8 w-8" />
                        </a>
                        <a href="#" className="text-foreground/50 hover:text-primary-500 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-8 w-8" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
