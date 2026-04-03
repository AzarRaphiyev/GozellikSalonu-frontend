import { ReservationWizard } from "@/components/reservation/ReservationWizard";

export const metadata = {
    title: "Rezervasiya | Gözəllik Salonu",
    description: "Sadaladığımız xidmətlər arasından seçim edərək, asanlıqla rezervasiya edin.",
};

export default function ReservationPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 py-12 px-4 dark:bg-zinc-950/50 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 text-center sm:mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Onlayn Rezervasiya
                    </h1>
                    <p className="mt-4 text-base text-foreground/60 max-w-2xl mx-auto">
                        İstədiyiniz xidmət növünü, mütəxəssisi və sizin üçün uyğun olan vaxtı seçin.
                        Cəmi bir neçə addımda qeydiyyatınızı tamamlayın.
                    </p>
                </div>

                <ReservationWizard />
            </div>
        </div>
    );
}
