"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { az } from "date-fns/locale";

interface Step3DateTimeProps {
    selectedProfessional: any;
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string) => void;
}

export function Step3DateTime({
    selectedProfessional,
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime
}: Step3DateTimeProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    // TEST ÜÇÜN STATİK SAATLAR (Əgər API işləməsə bunlar görünəcək)
    const fallbackSlots = ["09:00", "09:30", "10:00", "11:00", "12:30", "14:00", "15:30", "17:00"];

    React.useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate) return;

            if (!selectedProfessional) {
                console.warn("Usta seçilməyib, test saatları yüklənir...");
                setAvailableSlots(fallbackSlots);
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

                // --- YENİ MƏNTİQ: KEÇMİŞ SAATLARI FİLTRLƏMƏK ---
                const now = new Date();
                const isToday = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
                
                if (isToday) {
                    // Cari saatı və dəqiqəni alırıq (məsələn, 11:15)
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();
                    
                    // Yalnız indiki vaxtdan SONRAKI saatları saxlayırıq
                    fetchedSlots = fetchedSlots.filter(time => {
                        const [slotHour, slotMinute] = time.split(':').map(Number);
                        
                        // Əgər slotun saatı indiki saatdan böyükdürsə -> keçir
                        if (slotHour > currentHour) return true;
                        
                        // Əgər saat eynidirsə, dəqiqəyə baxırıq (heç olmasa 15-20 dəqiqə margin vermək yaxşıdır)
                        if (slotHour === currentHour && slotMinute > currentMinute) return true;
                        
                        // Qalan hallarda (keçmiş saatlar) -> blokla
                        return false;
                    });
                }

                setAvailableSlots(fetchedSlots);

            } catch (error) {
                console.error("API Xətası:", error);
                setAvailableSlots(fallbackSlots);
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-foreground">
                    <CalendarIcon className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-semibold">Tarix seçin</h2>
                </div>

                <div className="bg-background border border-border/40 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-medium capitalize text-foreground">
                            {format(currentMonth, 'LLLL yyyy', { locale: az })}
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-foreground"><ChevronLeft /></button>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-foreground"><ChevronRight /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                        {weekDays.map(d => <div key={d} className="text-[10px] uppercase text-foreground/50 font-bold">{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} />)}
                        {days.map(day => {
                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                            return (
                                <button
                                    key={day}
                                    disabled={isPast}
                                    onClick={() => onSelectDate(date)}
                                    className={`h-10 w-full rounded-lg text-sm transition-all
                                        ${isPast ? 'opacity-20 cursor-not-allowed text-foreground' : 'hover:bg-primary-100 dark:hover:bg-primary-900/30 text-foreground'}
                                        ${isSelected ? 'bg-primary-500 text-white font-bold hover:bg-primary-600 dark:hover:bg-primary-600' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-foreground">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-semibold">Saat seçin</h2>
                </div>

                <div className="bg-background border border-border/40 rounded-2xl p-6 min-h-[300px] shadow-sm">
                    {loading ? (
                        <div className="h-full flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary-500" /></div>
                    ) : selectedDate ? (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSlots.length > 0 ? (
                                availableSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => onSelectTime(time)}
                                        className={`py-3 rounded-xl text-sm border transition-all
                                            ${selectedTime === time ? 'bg-primary-500 border-primary-500 text-white shadow-md' : 'border-border/60 text-foreground hover:border-primary-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                                        `}
                                    >
                                        {time}
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-10 text-red-500 text-sm">
                                    Bu gün üçün boş saat qalmayıb.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-foreground/50 text-sm italic">
                            Zəhmət olmasa təqvimdən gün seçin.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}