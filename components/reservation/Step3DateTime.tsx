"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface Step3DateTimeProps {
    selectedProfessional: any;
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string) => void;
}

const ALL_POSSIBLE_SLOTS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
];

export function Step3DateTime({
    selectedProfessional,
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime
}: Step3DateTimeProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [availableSlotsFromAPI, setAvailableSlotsFromAPI] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    const fallbackSlots = ["09:00", "09:30", "10:00", "11:00", "12:30", "14:00", "15:30", "17:00"];

    React.useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate) return;

            if (!selectedProfessional) {
                console.warn("Usta seçilməyib, test saatları yüklənir...");
                setAvailableSlotsFromAPI(fallbackSlots);
                return;
            }

            try {
                setLoading(true);
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const response = await api.get(`/availability/${selectedProfessional.id}?date=${formattedDate}`);
                const data = response.data || response;

                let fetchedSlots = fallbackSlots;

                if (Array.isArray(data) && data.length > 0) {
                    fetchedSlots = data;
                }

                setAvailableSlotsFromAPI(fetchedSlots);

            } catch (error) {
                console.error("API Xətası:", error);
                setAvailableSlotsFromAPI(fallbackSlots);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, selectedProfessional]);

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + offset);
        setCurrentMonth(newMonth);
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ["B.e", "Ç.a", "Çər", "C.a", "Cüm", "Şən", "Baz"];

    // Combine ALL_POSSIBLE_SLOTS with any custom slots returned by API to ensure we render everything
    const displaySlots = React.useMemo(() => {
        const uniqueSet = new Set([...ALL_POSSIBLE_SLOTS, ...availableSlotsFromAPI]);
        const sorted = Array.from(uniqueSet).sort((a, b) => {
            const [aH, aM] = a.split(':').map(Number);
            const [bH, bM] = b.split(':').map(Number);
            return aH * 60 + aM - (bH * 60 + bM);
        });
        return sorted;
    }, [availableSlotsFromAPI]);

    const isSlotDisabled = (time: string, date: Date | null) => {
        if (!date) return true;
        const now = new Date();
        const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

        // It is not available in the API response
        if (!availableSlotsFromAPI.includes(time)) {
            return true;
        }

        if (isToday) {
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const [slotHour, slotMinute] = time.split(':').map(Number);

            if (slotHour < currentHour) return true;
            if (slotHour === currentHour && slotMinute <= currentMinute) return true;
        }

        return false;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-foreground">
                    <CalendarIcon className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-semibold">Tarix seçin</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative overflow-hidden bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl"
                >
                    {/* Subtle inner light reflection */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-lg font-medium capitalize text-foreground">
                            {format(currentMonth, 'LLLL yyyy', { locale: az })}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-foreground transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-foreground transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4 text-center relative z-10">
                        {weekDays.map(d => (
                            <div key={d} className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 relative z-10">
                        {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} />)}
                        {days.map(day => {
                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                            return (
                                <motion.button
                                    key={day}
                                    whileHover={!isPast && !isSelected ? { scale: 1.05 } : {}}
                                    whileTap={!isPast ? { scale: 0.95 } : {}}
                                    disabled={isPast}
                                    onClick={() => onSelectDate(date)}
                                    className={`relative z-10 flex items-center justify-center h-10 w-full rounded-xl text-sm transition-colors duration-300
                                        ${isPast ? 'opacity-30 cursor-not-allowed text-foreground line-through' : 'text-foreground'}
                                        ${isSelected ? 'text-white font-semibold shadow-lg shadow-primary-500/50' : !isPast && 'hover:bg-primary-500/10 dark:hover:bg-primary-500/20'}
                                    `}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="selectedDay"
                                            className="absolute inset-0 bg-primary-500 rounded-xl z-[-1]"
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        />
                                    )}
                                    {day}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-foreground">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-semibold">Saat seçin</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                    className="relative overflow-hidden bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 min-h-[300px] shadow-xl"
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    {loading ? (
                        <div className="h-full flex items-center justify-center py-20 relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader2 className="text-primary-500 w-8 h-8" />
                            </motion.div>
                        </div>
                    ) : selectedDate ? (
                        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 relative z-10">
                            <AnimatePresence>
                                {displaySlots.map((time, index) => {
                                    const disabled = isSlotDisabled(time, selectedDate);
                                    const isSelected = selectedTime === time;

                                    return (
                                        <motion.button
                                            key={time}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: disabled ? 0.3 : 1, y: 0 }}
                                            transition={{
                                                delay: index * 0.03,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24
                                            }}
                                            whileHover={!disabled && !isSelected ? { scale: 1.05 } : {}}
                                            whileTap={!disabled ? { scale: 0.92 } : {}}
                                            onClick={() => !disabled && onSelectTime(time)}
                                            disabled={disabled}
                                            className={`relative z-10 flex items-center justify-center py-3 rounded-xl text-sm transition-colors duration-300 border
                                                ${disabled ? 'border-transparent cursor-not-allowed line-through text-foreground' : 'cursor-pointer'}
                                                ${isSelected
                                                    ? 'text-white border-transparent shadow-lg shadow-primary-500/50 font-semibold'
                                                    : !disabled && 'border-white/20 dark:border-white/5 bg-foreground/5 text-foreground hover:border-primary-500/40 hover:bg-primary-500/5'}
                                            `}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="selectedTime"
                                                    className="absolute inset-0 bg-primary-500 rounded-xl z-[-1]"
                                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                />
                                            )}
                                            <span>{time}</span>
                                        </motion.button>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center py-20 text-foreground/50 text-sm italic relative z-10">
                            Zəhmət olmasa təqvimdən gün seçin.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}